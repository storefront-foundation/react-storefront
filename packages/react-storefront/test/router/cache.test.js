/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import ClientContext from '../../src/router/ClientContext'

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

  describe('on the server', () => {
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

      cache({ server: { maxAgeSeconds: 1000 } }).fn({}, {}, response)

      expect(response.cache).toEqual({ browserMaxAge: 0, serverMaxAge: 1000 })
    })

    it('should throw an error for non-get requests', () => {
      const response = new Response()
      process.env.MOOV_ENV = 'development'

      let error

      try {
        const cache = require('../../src/router').cache

        cache({ server: { maxAgeSeconds: 1000 } }).fn({}, { method: 'POST' }, response)
      } catch (e) {
        error = e
      } finally {
        delete process.env.MOOV_ENV
      }

      expect(error.message).toBe(
        'Invalid use of cache handler for POST request. Only GET requests can be cached.'
      )
    })

    describe('surrogateKey', () => {
      it('should send x-moov-surrogate-key', () => {
        const response = new Response()
        const cache = require('../../src/router').cache
        cache({ server: { surrogateKey: 'test' } }).fn({}, { method: 'POST' }, response)
        expect(response.get('x-moov-surrogate-key')).toBe('test')
      })
      it('should default to the route declared path', () => {
        const response = new Response()
        const cache = require('../../src/router').cache
        cache({ server: {} }).fn({}, { method: 'POST' }, response, {
          route: { declaredPath: '/p/:id' }
        })
        expect(response.get('x-moov-surrogate-key')).toBe('/p/:id')
      })
    })
  })

  describe('validation', () => {
    it('should only support get requests', () => {
      process.env.MOOV_RUNTIME = 'server'
      process.env.MOOV_ENV = 'development'
      const request = { method: 'post' }
      const cache = require('../../src/router').cache
      expect(() => cache({ server: {}, client: true }).fn({}, request)).toThrowError(
        /Only GET requests/
      )
    })
  })

  afterEach(() => {
    delete process.env.MOOV_RUNTIME
    delete process.env.MOOV_ENV
  })
})
