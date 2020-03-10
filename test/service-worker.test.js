import makeServiceWorkerEnv from 'service-worker-mock'
import url from 'url'

let sw

describe('service-worker', () => {
  beforeEach(() => {
    const serviceWorkerEnv = makeServiceWorkerEnv()
    Object.defineProperty(serviceWorkerEnv, 'addEventListener', {
      value: serviceWorkerEnv.addEventListener,
      enumerable: true,
    })
    Object.assign(global, serviceWorkerEnv)
    jest.resetModules()
    sw = require('../service-worker/service-worker')
  })

  describe('message listener', () => {
    it('should listen for messages to cache a url path', async () => {
      const apiVersion = 'v1'
      const apiCacheName = sw.__get__('getAPICacheName')(apiVersion)
      const path = '/api/p/1'
      const abortControllers = sw.__get__('abortControllers')
      expect(abortControllers.size).toEqual(0)
      await self.trigger('message', {
        data: {
          action: 'cache-path',
          path,
          apiVersion,
        },
      })
      expect(self.snapshot().caches[apiCacheName]).toBeDefined()
    })

    it('should listen for messages to cache data', async () => {
      const apiVersion = 'v1'
      const apiCacheName = sw.__get__('getAPICacheName')(apiVersion)
      const cacheData = { testData: 'testData1' }
      self.trigger('message', {
        data: {
          action: 'cache-state',
          path: 'testPath',
          cacheData,
          apiVersion,
        },
      })
      const cache = await caches.open(apiCacheName)
      const cachedValue = await cache.store.get('testPath').response.json()
      expect(cachedValue).toEqual(cacheData)
    })

    it('should listen for messages to configure caching options', async () => {
      await self.trigger('message', {
        data: {
          action: 'configure-runtime-caching',
          options: { maxEntries: 100, maxAgeSeconds: 1 },
        },
      })
      const options = sw.__get__('runtimeCacheOptions')
      expect(options.plugins[0]._config.maxEntries).toEqual(100)
      expect(options.plugins[0]._config.maxAgeSeconds).toEqual(1)
    })

    it('should listen for messages to abort prefetches', async () => {
      const abortControllers = sw.__get__('abortControllers')
      abortControllers.add(new AbortController())
      expect(abortControllers.size).toEqual(1)
      await self.trigger('message', {
        data: {
          action: 'abort-prefetches',
        },
      })
      expect(abortControllers.size).toEqual(0)
    })

    it('should listen for messages to resume prefetches', async () => {
      const cachePath = jest.fn()
      sw.__set__('cachePath', cachePath)
      const toResume = sw.__get__('toResume')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      await self.trigger('message', {
        data: {
          action: 'resume-prefetches',
        },
      })
      expect(cachePath).toHaveBeenCalled()
    })
  })

  describe('precacheLinks', () => {
    it('should detect all `data-rsf-prefetch` links in a response', async () => {
      const precacheLinks = sw.__get__('precacheLinks')
      const text = () =>
        Promise.resolve('<a href="/api/p/1">No</a><a href="/api/p/2" data-rsf-prefetch>Yes</a>')
      const abortControllers = sw.__get__('abortControllers')
      expect(abortControllers.size).toEqual(0)
      await precacheLinks({ text })
      expect(abortControllers.size).toEqual(1)
      expect(abortControllers.values().next().value.args[0].path).toEqual('/api/p/2')
    })

    it('should ignore links without `data-rsf-prefetch`', async () => {
      const precacheLinks = sw.__get__('precacheLinks')
      const text = () => Promise.resolve('<a href="/api/p/1">No</a>')
      const abortControllers = sw.__get__('abortControllers')
      await precacheLinks({ text })
      expect(abortControllers.size).toEqual(0)
    })
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

  describe('fetch listener', () => {
    it('should abort prefetches when fetching more important resources', async () => {
      const abortControllers = sw.__get__('abortControllers')
      const abortController = new AbortController()
      abortController.args = [{ path: '', apiVersion: 'v1' }]
      abortControllers.add(abortController)
      self.trigger('fetch', '')
      expect(abortControllers.size).toEqual(0)
      const toResume = sw.__get__('toResume')
      expect(toResume.size).toEqual(1)
    })

    it('should resume prefetches when non-prefetch fetch is done', async () => {
      const toResume = sw.__get__('toResume')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      await self.trigger('fetch', { request: new Request('') })
      expect(toResume.size).toEqual(0)
    })

    it('should resume prefetches even when non-prefetch fetch fails', async () => {
      const toResume = sw.__get__('toResume')
      toResume.add([{ path: '', apiVersion: 'v1' }])
      global.fetch = () => Promise.reject('failed')
      try {
        await self.trigger('fetch', { request: new Request('') })
      } catch (e) {}
      expect(toResume.size).toEqual(0)
    })
  })

  describe('util functions', () => {
    it('should detect if a path is for an API request', () => {
      const isApiRequest = sw.__get__('isApiRequest')
      expect(isApiRequest('/api/p/1')).toEqual(true)
      expect(isApiRequest('/p/1')).toEqual(false)
    })

    it('should detect if a request is using a secure connection', () => {
      const isSecure = sw.__get__('isSecure')
      const secureUrl = url.parse('https://wwww.example.com')
      const localhostUrl = url.parse('http://localhost:3000')
      const insecureUrl = url.parse('http://wwww.example.com')
      expect(isSecure({ url: secureUrl })).toEqual(true)
      expect(isSecure({ url: localhostUrl })).toEqual(true)
      expect(isSecure({ url: insecureUrl })).toEqual(false)
    })

    it('should detect if a request is for a static asset', () => {
      const isStaticAsset = sw.__get__('isStaticAsset')
      const staticUrl = url.parse('https://wwww.example.com/_next/static/asset.png')
      const nonStaticUrl = url.parse('https://www.example.com/p/1')
      expect(isStaticAsset({ url: staticUrl })).toEqual(true)
      expect(isStaticAsset({ url: nonStaticUrl })).toEqual(false)
    })

    it('should detect if a request is using amp', () => {
      const isAmp = sw.__get__('isAmp')
      const firstParamUrl = url.parse('https://wwww.example.com/p/1?amp=1')
      const laterParamUrl = url.parse('https://wwww.example.com/p/1?param1=test&amp=1')
      const innerParamUrl = url.parse('https://wwww.example.com/p/1?param1=test&amp=1&param2=test')
      const nonAmpUrl = url.parse('https://www.example.com/p/1')
      expect(isAmp(firstParamUrl)).toEqual(true)
      expect(isAmp(laterParamUrl)).toEqual(true)
      expect(isAmp(innerParamUrl)).toEqual(true)
      expect(isAmp(nonAmpUrl)).toEqual(false)
    })

    it('should detect if a request is for a video', () => {
      const isVideo = sw.__get__('isVideo')
      const videoUrl = url.parse('https://wwww.example.com/p/vid.mp4')
      const videoWithParamsUrl = url.parse('https://wwww.example.com/p/vid.mp4?autoplay=true')
      const nonVideoUrl = url.parse('https://www.example.com/p/1')
      expect(isVideo({ url: videoUrl })).toEqual(true)
      expect(isVideo({ url: videoWithParamsUrl })).toEqual(true)
      expect(isVideo({ url: nonVideoUrl })).toEqual(false)
    })
  })

  describe('install listener', () => {
    it('should delete existing runtime caches when installing', async () => {
      const cacheName = 'delete-me'
      const cache = await caches.open(cacheName)
      await cache.put('test', 'cached info')
      await self.trigger('install')
      console.log(self.clients.matchAll)
      expect(self.snapshot().caches[cacheName]).toBeUndefined()
    })

    it('should cache non-amp version of pages when users land on AMP page', async () => {
      const cachePath = jest.fn()
      sw.__set__('cachePath', cachePath)
      self.clients.clients.push(new Client('https://example.com/api/p/1?amp=1'))
      await self.trigger('install')
      console.log(self.snapshot().caches)
      expect(cachePath).toHaveBeenCalled()
    })
  })

  describe('matchRuntimePath', () => {
    it('should return true for routes that are cacheable', () => {
      const matchRuntimePath = sw.__get__('matchRuntimePath')
      expect(matchRuntimePath({ url: url.parse('http://example.com/p/1') })).toEqual(false)
      expect(
        matchRuntimePath({ url: url.parse('https://example.com/_next/static/asset') }),
      ).toEqual(false)
      expect(matchRuntimePath({ url: url.parse('https://example.com/p/1.mp4') })).toEqual(false)
      expect(matchRuntimePath({ url: url.parse('https://example.com/p/1') })).toEqual(true)
    })
  })

  describe('offlineResponse', () => {
    it('should send back a standard response for API calls', async () => {
      const offlineResponse = sw.__get__('offlineResponse')
      const resp = await offlineResponse('v1', { url: url.parse('/api/p/1') })
      expect(JSON.parse(resp.body.parts[0])).toEqual({ page: 'Offline' })
    })

    it('should send back the app shell for non-API calls', async () => {
      const appShellPath = sw.__get__('appShellPath')
      const testCachedData = 'test-cache-data'
      const offlineResponse = sw.__get__('offlineResponse')
      const apiVersion = 'v1'
      const apiCacheName = sw.__get__('getAPICacheName')(apiVersion)
      const addToCache = sw.__get__('addToCache')
      const cache = await caches.open(apiCacheName)
      await addToCache(cache, appShellPath, testCachedData)
      const resp = await offlineResponse(apiVersion, { url: url.parse('/p/1') })
      expect(resp.body.parts[0]).toEqual(testCachedData)
    })
  })
})
