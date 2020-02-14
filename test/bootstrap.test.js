import makeServiceWorkerEnv from 'service-worker-mock'
import makeFetchMock from 'service-worker-mock/fetch'

describe('bootstrap', () => {
  beforeEach(() => {
    const serviceWorkerEnv = makeServiceWorkerEnv()
    Object.defineProperty(serviceWorkerEnv, 'addEventListener', {
      value: serviceWorkerEnv.addEventListener,
      enumerable: true,
    })
    serviceWorkerEnv.workbox = {
      loadModule: () => null,
      expiration: { ExpirationPlugin: jest.fn() },
      routing: { registerRoute: jest.fn() },
    }
    Object.assign(global, serviceWorkerEnv, makeFetchMock())
    jest.resetModules()
    require('../service-worker/bootstrap')
  })

  it('should add data to the cache', async () => {
    const cacheData = { testData: 'testData1' }
    self.trigger('message', {
      data: {
        action: 'cache-state',
        path: 'testPath',
        cacheData,
        apiVersion: 'v1',
      },
    })
    const cache = await caches.open('runtime-v1')
    const cachedValue = await cache.store.get('testPath').response.json()

    expect(cachedValue).toEqual(cacheData)
  })

  it.todo('should abort prefetches when fetching more important resources')
})
