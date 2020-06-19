import {
  prefetch,
  prefetchJsonFor,
  waitForServiceWorker,
  resetPrefetches,
} from '../src/serviceWorker'

describe('all', () => {
  beforeEach(() => {
    process.env.SERVICE_WORKER = 'true'
  })

  afterEach(() => {
    delete process.env.SERVICE_WORKER
  })

  describe('serviceWorker', () => {
    let postMessage, addEventListener

    beforeEach(() => {
      postMessage = jest.fn()
      addEventListener = jest.fn((event, cb) => {
        setImmediate(cb)
      })
      navigator.serviceWorker = {
        ready: Promise.resolve(),
        controller: {
          postMessage,
        },
        addEventListener,
      }
    })

    describe('waitForServiceWorker', () => {
      it('should return true if navigator.serviceWorker.controller is defined', async () => {
        expect(await waitForServiceWorker()).toBe(true)
      })

      it('should wait for controllerchange if controller is not defined', async () => {
        delete navigator.serviceWorker.controller
        await waitForServiceWorker()
        expect(addEventListener).toHaveBeenCalledWith('controllerchange', expect.any(Function))
      })

      it('should return false if navigator.serviceWorker is undefined', async () => {
        delete navigator.serviceWorker
        expect(await waitForServiceWorker()).toBe(false)
      })

      it('should return false if navigator.serviceWorker.ready is undefined', async () => {
        delete navigator.serviceWorker.ready
        expect(await waitForServiceWorker()).toBe(false)
      })
    })
  })

  describe('prefetch', () => {
    beforeEach(() => {
      process.env.RSF_PREFETCH_QUERY_PARAM = '__prefetch__'
      document.head.innerHTML = ''
      window.__NEXT_DATA__ = {
        buildId: 'development',
      }
      resetPrefetches()
    })

    afterEach(() => {
      delete window.__NEXT_DATA__
      delete window.RSF_PREFETCH_QUERY_PARAM
    })

    describe('prefetch', () => {
      it('should append a single link tag per url', async () => {
        await prefetch('/foo')
        await prefetch('/foo')
        expect(
          document.head.querySelectorAll(
            'link[href="http://localhost/foo?__v__=development&__prefetch__=1"]',
          ),
        ).toHaveLength(1)
      })

      it('should not require window.RSF_PREFETCH_QUERY_PARAM to be defined', async () => {
        delete process.env.RSF_PREFETCH_QUERY_PARAM
        await prefetch('/foo')
        expect(
          document.head.querySelectorAll('link[href="http://localhost/foo?__v__=development"]'),
        ).toHaveLength(1)
      })

      it('should not add RSF_PREFETCH_QUERY_PARAM when fetching from a 3rd party', async () => {
        await prefetch('https://www.thirdparty.com/foo')

        expect(
          document.head.querySelectorAll(
            'link[href="https://www.thirdparty.com/foo?__v__=development"]',
          ),
        ).toHaveLength(1)
      })
    })

    describe('prefetchJsonFor', () => {
      it('should append the api prefix', async () => {
        await prefetchJsonFor('/foo')

        expect(
          document.head.querySelectorAll(
            'link[href="http://localhost/api/foo?__v__=development&__prefetch__=1"]',
          ),
        ).toHaveLength(1)
      })
      it('should not prefetch if process.env.SERVICE_WORKER is not defined', async () => {
        delete process.env.SERVICE_WORKER
        await prefetchJsonFor('/foo')

        expect(document.head.querySelectorAll('link')).toHaveLength(0)
      })
    })
  })
})
