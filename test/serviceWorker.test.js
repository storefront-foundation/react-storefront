import { prefetch, prefetchJsonFor, waitForServiceWorker } from '../src/serviceWorker'

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
