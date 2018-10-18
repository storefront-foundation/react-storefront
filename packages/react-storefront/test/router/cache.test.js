/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
describe('cache', () => {
  describe('on the client', () => {
    let cache, serviceWorker, Response

    beforeEach(() => {
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

    it('should set the cache-control header', () => {
      const cache = require('../../src/router').cache
      const response = new Response()
      
      cache({ server: { maxAgeSeconds: 1000 } })
        .fn({}, {}, response)
      
      expect(response.headers['cache-control']).toEqual('no-cache, s-maxage=1000')
    })
  })
})