import makeServiceWorkerEnv from 'service-worker-mock'
import makeFetchMock from 'service-worker-mock/fetch'

let sw

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
    sw = require('../service-worker/bootstrap')
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

  describe('abortPrefetches', () => {
    it('should abort existing prefetches', () => {
      const abortPrefetches = sw.__get__('abortPrefetches')
      const abortControllers = sw.__get__('abortControllers')
      abortControllers.add(new AbortController())
      expect(abortControllers.size).toEqual(1)
      abortPrefetches()
      expect(abortControllers.size).toEqual(0)
    })

    it('should add aborted prefetches to resume list', () => {
      const abortPrefetches = sw.__get__('abortPrefetches')
      const abortControllers = sw.__get__('abortControllers')
      const toResume = sw.__get__('toResume')
      abortControllers.add(new AbortController())
      expect(toResume.size).toEqual(0)
      abortPrefetches()
      expect(toResume.size).toEqual(1)
    })
  })

  describe('resumePrefetches', () => {
    it('should resume aborted prefetches', () => {
      const cachePath = jest.fn()
      sw.__set__('cachePath', cachePath)
      const toResume = sw.__get__('toResume')
      const resumePrefetches = sw.__get__('resumePrefetches')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      resumePrefetches()
      expect(cachePath).toHaveBeenCalled()
    })

    it('should clear the resume list when done resuming', () => {
      const toResume = sw.__get__('toResume')
      const resumePrefetches = sw.__get__('resumePrefetches')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      resumePrefetches()
      expect(toResume.size).toEqual(0)
    })
  })

  describe('fetch', () => {
    it('should abort prefetches when fetching more important resources', () => {
      const abortControllers = sw.__get__('abortControllers')
      const toResume = sw.__get__('toResume')
      abortControllers.add(new AbortController())
      self.trigger('fetch')
      expect(abortControllers.size).toEqual(0)
      expect(toResume.size).toEqual(1)
    })

    it('should resume prefetches when non-prefetch fetch is done', async () => {
      const toResume = sw.__get__('toResume')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      await self.trigger('fetch')
      expect(toResume.size).toEqual(0)
    })
  })
})
