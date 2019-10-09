/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Helmet from 'react-helmet'
import PWA from '../src/PWA'
import Server from '../src/Server'
import createTheme from '../src/createTheme'
import AppModelBase from '../src/model/AppModelBase'
import { Router, fromServer } from '../src/router'
import React from 'react'
import $ from 'cheerio'
import Request from '../../react-storefront-moov-xdn/src/Request'
import Response from '../../react-storefront-moov-xdn/src/Response'
import requestContext from '../src/requestContext'
import '../../react-storefront-moov-xdn/src/requestContext'

describe('Server', () => {
  let router, theme, blob, globals, model, App, exported, request, response

  beforeEach(() => {
    exported = {}
    Helmet.canUseDOM = false // otherwise Helmet throws an error about calling rewind on the client
    App = () => <div>App</div>
    model = AppModelBase
    router = new Router().get('/test', fromServer(() => ({ page: 'Test' })))
    theme = createTheme()
    blob = {}
    global.__build_timestamp__ = new Date().getTime().toString()
    global.sendResponse = jest.fn()
    global.requestBody = ''
    global.$ = $
    global.fns = {
      export: (key, value) => (exported[key] = value),
      init$: html => ({ $: $.load(html) })
    }
    global.env = {
      node_env: 'production',
      requestBody: '',
      headers: JSON.stringify({}),
      path: '/test',
      method: 'get',
      host: 'moovweb.com:80',
      host_no_port: 'moovweb.com',
      secure: true
    }
    request = new Request()
    response = new Response(request)
  })

  afterEach(() => {
    delete global.sendResponse
    delete global.env
    delete global.requestBody
    delete global.fns
    delete global.$
  })

  describe('serve', () => {
    it('should send an html response', async () => {
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalled()
      expect(exported.MOOV_PWA_RESPONSE.headers['content-type']).toBe('text/html')
    })

    it('should prevent XSS attacks via malicious URL parameters injected into link rel="canonical"', async () => {
      global.env.path = `/'"/>--></title></style></script%20dt=fy><dtfy>`
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const body = global.sendResponse.mock.calls[0][0].body
      expect(body).not.toContain(`"/>--></title></style></script%20dt=fy><dtfy>`)
    })

    it('should send a json response', async () => {
      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalled()
      expect(exported.MOOV_PWA_RESPONSE.headers['content-type']).toBe('application/json')
    })

    it('should set prefetch headers', async () => {
      global.env.path = '/test'
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(exported.MOOV_PWA_RESPONSE.headers.link).toBe('</pwa/main.js>; rel=preload; as=script')
    })

    it('should render scripts', async () => {
      global.env.path = '/test'
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const body = global.sendResponse.mock.calls[0][0].body
      expect(body).toContain('<script type="text/javascript" defer src="/pwa/main.js"></script>')
    })

    it('should allow you to override the content-type', async () => {
      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)

      const router = new Router().get(
        '/test',
        fromServer((params, request, response) => {
          response.set('content-type', 'application/foo')
          return { page: 'Test' }
        })
      )

      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalled()
      expect(exported.MOOV_PWA_RESPONSE.headers['content-type']).toBe('application/foo')
    })

    it('should render amp', async () => {
      global.env.path = '/test.amp'
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalled()
    })

    it('should send a json response if the path ends with .json', async () => {
      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const body = JSON.parse(global.sendResponse.mock.calls[0][0].body)
      expect(body.page).toBe('Test')
    })

    it('should not do SSR when the response has already been sent', async () => {
      router = new Router().get(
        '/test',
        fromServer((params, request, response) => {
          response.send(JSON.stringify({ foo: 'bar' }))
        })
      )

      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalledWith({
        body: JSON.stringify({ foo: 'bar' }),
        htmlparsed: true
      })
      expect(global.sendResponse.mock.calls.length).toBe(1)
    })

    it('should allow the user to override the viewport', async () => {
      const viewport =
        'width=device-width, initial-scale=.5, maximum-scale=12.0, minimum-scale=.25, user-scalable=yes'

      const App = () => (
        <PWA>
          <Helmet>
            <meta name="viewport" content={viewport} />
          </Helmet>
        </PWA>
      )

      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const data = global.sendResponse.mock.calls[0][0]
      expect($.load(data.body)('meta[name=viewport]').attr('content')).toBe(viewport)
    })

    it('should include the provided state in window.initialState', async () => {
      const App = () => (
        <PWA>
          <div>test</div>
        </PWA>
      )

      const state = { mode: { id: '0', name: 'default' } }
      await new Server({ theme, model, router, blob, globals, App, state }).serve(request, response)
      const data = global.sendResponse.mock.calls[0][0]
      expect(data.body).toContain(JSON.stringify(state.mode))
    })

    it('should call transform and return the result', async () => {
      const App = () => (
        <PWA>
          <div>test</div>
        </PWA>
      )

      let passedHtml
      const body = '<div>foo</div>'

      const transform = html => {
        passedHtml = html
        return body
      }

      await new Server({ theme, model, router, blob, globals, App, transform }).serve(
        request,
        response
      )

      const data = global.sendResponse.mock.calls[0][0]

      expect(passedHtml).toContain('<div>test</div>')
      expect(data).toEqual({ body, htmlparsed: true })
    })

    it('should redirect to non-AMP page when AMP is requested but both @withAmp is not used and AMP transform was not called', async () => {
      const App = () => <div />

      const router = new Router().get(
        '/nope',
        fromServer(() => {
          return {}
        })
      )

      global.env.path = '/nope.amp'
      request = new Request()
      response = new Response(request)

      const spy = jest.spyOn(response, 'redirect')

      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)

      expect(spy).toHaveBeenCalledWith('/nope', 302)
    })

    it('should redirect to non-AMP page when AMP is requested but AMP transform has never been used', async () => {
      const App = () => <div />

      const router = new Router().get(
        '/test',
        fromServer(() => {
          return {}
        })
      )

      global.env.path = '/test.amp?foo=bar'
      request = new Request()
      response = new Response(request)

      const spy = jest.spyOn(response, 'redirect')

      requestContext.set('amp-enabled', true)

      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)

      expect(spy).toHaveBeenCalledWith('/test?foo=bar', 302)
    })

    it('should not redirect when AMP is requested and @withAmp is used and has been transformed', async () => {
      const App = () => <div />

      const router = new Router().get(
        '/test',
        fromServer(() => {
          return {}
        })
      )

      global.env.path = '/test.amp'
      request = new Request()
      response = new Response(request)

      const spy = jest.spyOn(response, 'redirect')

      // acts as @withAmp
      requestContext.set('amp-enabled', true)
      // acts as AMP transformation
      requestContext.set('amp-transformed', true)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)

      expect(spy).not.toHaveBeenCalled()
    })
  })

  describe('errorReporter', () => {
    let errorReporter, error

    beforeEach(() => {
      errorReporter = jest.fn()
      error = new Error()
    })

    it('should be called when an error is thrown during rendering', async () => {
      const App = () => {
        throw error
      }

      await new Server({ theme, model, router, blob, globals, App, errorReporter }).serve(
        request,
        response
      )

      expect(errorReporter).toHaveBeenCalledWith({
        error,
        history: expect.anything(),
        app: expect.anything()
      })
    })

    it('should be called when an error is thrown from the router while serving HTML', async () => {
      const App = () => <div />

      const router = new Router().get(
        '/test',
        fromServer(() => {
          throw error
        })
      )

      await new Server({ theme, model, router, blob, globals, App, errorReporter }).serve(
        request,
        response
      )

      expect(errorReporter).toHaveBeenCalledWith({
        error,
        history: expect.anything(),
        app: undefined
      })
    })

    it('should be called when an error is thrown from the router during while serving JSON', async () => {
      const App = () => <div />

      const router = new Router().get(
        '/test',
        fromServer(() => {
          throw error
        })
      )

      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)

      await new Server({ theme, model, router, blob, globals, App, errorReporter }).serve(
        request,
        response
      )

      expect(errorReporter).toHaveBeenCalledWith({
        error,
        history: expect.anything(),
        app: undefined
      })
    })
  })
})
