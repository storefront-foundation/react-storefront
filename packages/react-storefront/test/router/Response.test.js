/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { Response } from '../../src/router'

describe('Response', () => {
  let oldFns, response, request

  beforeEach(() => {
    oldFns = global.fns
    global.fns = { export: jest.fn() }
    global.env = {}
    request = { sendResponse: jest.fn(), hostname: "localhost" }
    response = new Response(request)
  })

  afterEach(() => {
    global.fns = oldFns
  })

  describe('send', () => {
    it('should export env.MOOV_PWA_RESPONSE', () => {
      response
        .status(500, 'error')
        .set('x-moov-test', 'test')
        .send('foo')

      expect(global.fns.export).toBeCalledWith('MOOV_PWA_RESPONSE', {
        statusCode: 500,
        statusText: 'error',
        redirectTo: null,
        cookies: [],
        headers: {
          'cache-control': 'no-cache',
          'x-moov-test': 'test'
        }
      })
    })

    it('should relay upstream cookies', () => {
      env.MUR_SET_COOKIES = {
        "www.example.com": [
          'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2; Domain=www.example.com; Path=/; HttpOnly;'
        ]
      }

      response.send('foo')

      expect(global.fns.export).toBeCalledWith('MOOV_PWA_RESPONSE', {
        statusCode: 200,
        statusText: 'OK',
        redirectTo: null,
        cookies: [
          'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2; Domain=www.example.com; Path=/; HttpOnly;',
          'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2; Path=/; HttpOnly;'
        ],
        headers: {
          'cache-control': 'no-cache'
        }
      })
    })

    it('should not relay upstream cookies if relayUpstreamCookies(false) is called', () => {
      env.MUR_SET_COOKIES = {
        "www.example.com": [
          'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2; Domain=www.example.com; Path=/; HttpOnly;'
        ]
      }

      response
        .relayUpstreamCookies(false)
        .send('foo')

      expect(global.fns.export).toBeCalledWith('MOOV_PWA_RESPONSE', {
        statusCode: 200,
        statusText: 'OK',
        redirectTo: null,
        cookies: [],
        headers: {
          'cache-control': 'no-cache'
        }
      })
    })

    it('should call request.sendResponse', () => {
      response
        .send('foo')

      expect(request.sendResponse).toBeCalledWith({ body: 'foo', htmlparsed: true })
    })

    it('should send htmlparsed:false when no arguments are provided', () => {
      response.send()
      expect(request.sendResponse).toBeCalledWith({ htmlparsed: false })
    })
  })

  describe('cacheOnClient', () => {
    it('should be default by default', () => {
      expect(response.clientCache).toBe('default')
    })

    it('should set force-cache when true is passed', () => {
      response.cacheOnClient(true)
      expect(response.clientCache).toBe('force-cache')
    })

    it('should set default when false is passed', () => {
      response.cacheOnClient(false)
      expect(response.clientCache).toBe('default')
    })

    it('should return the response', () => {
      expect(response.cacheOnClient(true)).toBe(response)
    })

    it('should throw an Error if no parameter is provided', () => {
      expect(() => response.cacheOnClient()).toThrow()
    })
  })

  describe('cacheOnServer', () => {
    it('should set the cache-control header', () => {
      response.cacheOnServer(100)
      expect(response.headers['cache-control']).toBe('no-cache, s-maxage=100')
    })

    it('should set the cache-control header to no-cache by default', () => {
      expect(response.headers['cache-control']).toBe('no-cache')
    })

    it('should return the response', () => {
      expect(response.cacheOnServer(100)).toBe(response)
    })

    it('should throw an Error if no parameter is provided', () => {
      expect(() => response.cacheOnServer()).toThrow()
    })
  })

  describe('status', () => {
    it('should return the response', () => {
      expect(response.status(404)).toBe(response)
    })
    
    it('should set statusCode and statusText', () => {
      response.status(404, 'not found')
      expect(response.statusCode).toBe(404)
      expect(response.statusText).toBe('not found')
    })
  })

  describe('redirect', () => {
    it('should return the response', () => {
      expect(response.redirect('/foo')).toBe(response)
    })
    
    it('should set redirectTo and statusCode', () => {
      response.redirect('/foo', 302)
      expect(response.redirectTo).toBe('/foo')
      expect(response.statusCode).toBe(302)
    })

    it('should set statusCode to 301 by default', () => {
      response.redirect('/foo')
      expect(response.statusCode).toBe(301)
    })

    it('should throw an error if no url is specified', () => {
      expect(() => response.redirect()).toThrow()
    })
  })

  describe('set', () => {
    it('should throw an error if no key is specified', () => {
      expect(() => response.set()).toThrow()
    })
  })
})