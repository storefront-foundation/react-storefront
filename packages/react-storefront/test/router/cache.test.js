/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
describe('cache', () => {
  describe('on the client', () => {
    let cache, serviceWorker, Response

    beforeEach(() => {
      global.env = {}
      process.env.MOOV_RUNTIME = 'client'
      jest.mock('../../src/router/serviceWorker')
      serviceWorker = require('../../src/router/serviceWorker')
      cache = require('../../src/router').cache
      Response = require('../../src/router').Response
    })
  
    afterEach(() => {
      delete process.env.MOOV_RUNTIME
      jest.unmock('../../src/router/serviceWorker')
    })
  
    it('should set context.cache to force-cache', () => {
      const instance = cache({ client: true })
      const response = new Response()
      instance.fn(null, null, response)
      expect(response.clientCache).toBe('force-cache')
    })
  })

  describe('on the server', () => {
    let Response

    beforeEach(() => {
      Response = require('../../src/router/Response').default
    })

    it('should set response.cache', () => {
      const cache = require('../../src/router').cache
      const response = new Response()
      
      cache({ server: { maxAgeSeconds: 1000 } })
        .fn({}, {}, response)
      
      expect(response.cache).toEqual({ browserMaxAge: 0, serverMaxAge: 1000 })
    })

    it('should throw an error for non-get requests', () => {
      const response = new Response()
      process.env.MOOV_RUNTIME = 'server'
      process.env.MOOV_ENV = 'development'

      let error
  
      try {
        const cache = require('../../src/router').cache

        cache({ server: { maxAgeSeconds: 1000 } })
          .fn({}, { method: 'POST' }, response)
      } catch (e) {
        error = e
      } finally {
        delete process.env.MOOV_RUNTIME
        delete process.env.MOOV_ENV
      }

      expect(error.message).toBe('Invalid use of cache handler for POST request. Only GET requests can be cached.')
    })
  })
})