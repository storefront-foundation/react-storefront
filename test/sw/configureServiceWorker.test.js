describe('configureServiceWorker', () => {
  let CacheFirst,
    skipWaiting,
    clientsClaim,
    precacheAndRoute,
    ExpirationPlugin,
    CacheableResponsePlugin,
    registerRoute,
    configureServiceWorker,
    expirationConfig,
    cacheableResponseConfig,
    cacheFirstConfig

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.spyOn(console, 'log').mockImplementation()
      skipWaiting = jest.fn()
      clientsClaim = jest.fn()
      precacheAndRoute = jest.fn()
      registerRoute = jest.fn()
      ExpirationPlugin = class {
        constructor(config) {
          expirationConfig = config
        }
      }
      CacheableResponsePlugin = class {
        constructor(config) {
          cacheableResponseConfig = config
        }
      }
      CacheFirst = class {
        constructor(config) {
          cacheFirstConfig = config
        }
      }

      jest.doMock('workbox-expiration', () => ({
        ExpirationPlugin,
      }))
      jest.doMock('workbox-cacheable-response', () => ({
        CacheableResponsePlugin,
      }))
      jest.doMock('workbox-precaching', () => ({
        precacheAndRoute,
      }))
      jest.doMock('workbox-core', () => ({
        skipWaiting,
        clientsClaim,
      }))
      jest.doMock('workbox-routing', () => ({
        registerRoute,
      }))
      jest.doMock('workbox-strategies', () => ({
        CacheFirst,
      }))

      self.origin = 'http://localhost'

      configureServiceWorker = require('../../src/sw/configureServiceWorker').default
    })
  })

  it('should cache api requests', () => {
    configureServiceWorker({
      api: [
        {
          path: '/api/p/[productId]',
          maxAgeSeconds: 60,
        },
      ],
    })
    expect(registerRoute).toHaveBeenCalledWith(
      /http:\/\/localhost\/api\/p\/[^/]+($|\?.*$)/i,
      expect.any(CacheFirst),
    )
    expect(cacheableResponseConfig).toEqual({
      statuses: [200],
    })
    expect(expirationConfig).toEqual({
      maxAgeSeconds: 60,
    })
  })

  it('should accept custom cacheable statuses', () => {
    configureServiceWorker({
      api: [
        {
          path: '/api/p/[productId]',
          maxAgeSeconds: 60,
          statuses: [200, 302],
        },
      ],
    })
    expect(registerRoute).toHaveBeenCalledWith(
      /http:\/\/localhost\/api\/p\/[^/]+($|\?.*$)/i,
      expect.any(CacheFirst),
    )
    expect(cacheableResponseConfig).toEqual({
      statuses: [200, 302],
    })
    expect(expirationConfig).toEqual({
      maxAgeSeconds: 60,
    })
  })

  it('should not require an api config', () => {
    expect(() => configureServiceWorker({})).not.toThrowError()
  })
})
