/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import ClientContext from '../../src/router/ClientContext'
import { createCustomCacheKey } from '../../src/router'

describe('cache', () => {
  describe('on the client', () => {
    let cache, Response

    beforeEach(() => {
      global.env = {}
      process.env.MOOV_RUNTIME = 'client'
      jest.mock('../../src/router/serviceWorker')
      cache = require('../../src/router').cache
    })

    afterEach(() => {
      delete process.env.MOOV_RUNTIME
      jest.unmock('../../src/router/serviceWorker')
    })

    it('should set context.cache to force-cache', () => {
      const instance = cache({ client: true })
      const context = new ClientContext()
      instance.fn(null, null, context)
      expect(context.clientCache).toBe('force-cache')
    })
  })

  describe('on the edge', () => {
    let Response

    beforeEach(() => {
      Response = require('../../../react-storefront-moov-xdn/src/Response').default
      process.env.MOOV_RUNTIME = 'server'
    })

    afterEach(() => {
      delete process.env.MOOV_RUNTIME
    })

    it('should set response.cache', () => {
      const cache = require('../../src/router').cache
      const response = new Response()

      cache({ edge: { maxAgeSeconds: 1000 } }).fn({}, {}, response)

      expect(response.cache).toEqual({ browserMaxAge: 0, serverMaxAge: 1000 })
    })

    it('should support "server" in lieu of "edge" for backwards compatibility', () => {
      const cache = require('../../src/router').cache
      const response = new Response()
      cache({ edge: { maxAgeSeconds: 1000 } }).fn({}, {}, response)
      expect(response.cache).toEqual({ browserMaxAge: 0, serverMaxAge: 1000 })
    })

    it('should throw an error for non-get requests', () => {
      const response = new Response()
      process.env.MOOV_ENV = 'development'

      let error

      try {
        const cache = require('../../src/router').cache

        cache({ edge: { maxAgeSeconds: 1000 } }).fn({}, { method: 'POST' }, response)
      } catch (e) {
        error = e
      } finally {
        delete process.env.MOOV_ENV
      }

      expect(error.message).toBe(
        'Invalid use of cache handler for POST request. Only GET requests can be cached.'
      )
    })

    it('should send x-moov-surrogate-key', () => {
      const response = new Response()
      const cache = require('../../src/router').cache
      cache({ edge: { surrogateKey: () => 'test' } }).fn({}, { method: 'POST' }, response)
      expect(response.get('x-moov-surrogate-key')).toBe('test')
    })

    it('should set shouldSendCookies to false when maxAgeSeconds is specified', () => {
      const cache = require('../../src/router').cache
      const request = {}

      cache({
        edge: {
          maxAgeSeconds: 100
        },
        client: true
      }).fn({}, request, new Response(request))

      expect(global.env.shouldSendCookies).toEqual(false)
    })

    describe('key', () => {
      it('should set shouldSendCookies when a custom cache key is specified', () => {
        const cache = require('../../src/router').cache
        const request = {}

        cache({
          edge: {
            maxAgeSeconds: 100,
            key: createCustomCacheKey()
              .addCookie('currency')
              .addCookie('location')
          },
          client: true
        }).fn({}, request, new Response(request))

        expect(global.env.shouldSendCookies).toEqual(['currency', 'location'])
      })
    })
  })

  describe('validation', () => {
    it('should only support get requests', () => {
      process.env.MOOV_RUNTIME = 'server'
      process.env.MOOV_ENV = 'development'
      const request = { method: 'post' }
      const cache = require('../../src/router').cache
      expect(() => cache({ edge: {}, client: true }).fn({}, request)).toThrowError(
        /Only GET requests/
      )
    })
  })

  afterEach(() => {
    delete process.env.MOOV_RUNTIME
    delete process.env.MOOV_ENV
  })
})
