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
import { inject } from 'mobx-react'
import $ from 'cheerio'
import Request from '../../react-storefront-moov-xdn/src/Request'
import Response from '../../react-storefront-moov-xdn/src/Response'

describe('Server', () => {
  let router, theme, blob, globals, model, App, exported, request, response

  beforeEach(() => {
    exported = {}
    Helmet.canUseDOM = false // otherwise Helmet throws an error about calling rewind on the client
    App = () => <div>App</div>
    model = AppModelBase, 
    router = new Router().get('/test', fromServer(() => ({ page: 'Test' })))
    theme = createTheme()
    blob = {}
    global.__webpack_hash__ = '0.0.0'
    global.sendResponse = jest.fn()
    global.requestBody = ''
    global.$ = $,
    global.fns = {
      export: (key, value) => exported[key] = value,
      init$:  html => ({ $: $.load(html) })
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
      expect(exported.MOOV_PWA_RESPONSE.headers['x-rsf-track-cache-hit']).toBe('true')
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

    it('should allow you to override the content-type', async () => {
      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)

      const router = new Router()
        .get('/test', 
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
      expect(exported.MOOV_PWA_RESPONSE.headers['x-rsf-track-cache-hit']).toBe('true')
    })

    it('should send a json response if the path ends with .json', async () => {
      global.env.path = '/test.json'
      request = new Request()
      response = new Response(request)
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const body = JSON.parse(global.sendResponse.mock.calls[0][0].body)
      expect(body.page).toBe('Test')
      expect(exported.MOOV_PWA_RESPONSE.headers['x-rsf-track-cache-hit']).toBe('true')
    })

    it('should catch errors and render the error view', async () => {
      const App = inject('app')(({ app }) => {
        if (app.error) {
          return (
            <div>
              <div className="page">{app.page}</div>
              <div className="error">{app.error}</div>
              <div className="stack">{app.stack}</div>
            </div>
          )
        } else {
          throw new Error('test')
        }
      })

      await new Server({ theme, model, router, blob, App }).serve(request, response)
      const { body } = global.sendResponse.mock.calls[0][0]
      expect(body).toMatch(/<div class="page">Error<\/div>/)
      expect(body).toMatch(/<div class="error">test<\/div>/)
      expect(body).toMatch(/<div class="stack">[^<]+<\/div>/)
    })

    it('should not do SSR when the response has already been sent', async () => {
      router = new Router()
        .get('/test', 
          fromServer((params, request, response) => {
            response.send(JSON.stringify({ foo: 'bar' }))
          })
        )
        
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      expect(global.sendResponse).toBeCalledWith({ body: JSON.stringify({ foo: "bar" }), htmlparsed: true })
      expect(global.sendResponse.mock.calls.length).toBe(1)
    })

    it('should allow the user to override the viewport', async () => {
      const viewport = 'width=device-width, initial-scale=.5, maximum-scale=12.0, minimum-scale=.25, user-scalable=yes'

      const App = () => (
        <PWA>
          <Helmet>
            <meta name="viewport" content={viewport}/>
          </Helmet>
        </PWA>
      )
  
      await new Server({ theme, model, router, blob, globals, App }).serve(request, response)
      const data = global.sendResponse.mock.calls[0][0]
      expect($.load(data.body)('meta[name=viewport]').attr('content')).toBe(viewport)
    })

    it('should call transform and return the result', async () => {
      const App = () => (
        <PWA>
          <div>test</div>
        </PWA>
      )

      let called = false
      const body = '<div>foo</div>'

      const transform = html => {
        called = true
        expect(html).toMatch(/<!DOCTYPE html>.*<div>test<\/div>/)
        return body
      }

      await new Server({ theme, model, router, blob, globals, App, transform }).serve(request, response)
      const data = global.sendResponse.mock.calls[0][0]

      expect(data).toEqual({ body, htmlparsed: true })
      expect(called).toBe(true)
    })
  })
})