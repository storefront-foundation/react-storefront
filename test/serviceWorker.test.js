import { prefetch, prefetchJsonFor, waitForServiceWorker } from '../src/serviceWorker'

describe('serviceWorker', () => {
  let postMessage, addEventListener

  beforeEach(() => {
    postMessage = jest.fn()
    process.env.RSF_API_VERSION = '10'
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

  describe('prefetch', () => {
    it('should post a message with action: cache-path', async () => {
      await prefetch('/api/p/1')

      expect(postMessage).toHaveBeenCalledWith({
        action: 'cache-path',
        path: '/api/p/1',
        apiVersion: '10',
      })
    })
    it('should send apiVersion = 1 when RSF_API_VERSION is undefined', async () => {
      delete process.env.RSF_API_VERSION
      await prefetch('/api/p/1')

      expect(postMessage).toHaveBeenCalledWith({
        action: 'cache-path',
        path: '/api/p/1',
        apiVersion: '1',
      })
    })
    it('should not send a message if navigator.serviceWorker is not defined', async () => {
      delete navigator.serviceWorker
      await prefetch('/api/p/1')
      expect(postMessage).not.toHaveBeenCalled()
    })
  })

  describe('prefetchJsonFor', () => {
    it('should derive the api URL from the page URL', async () => {
      await prefetchJsonFor('http://localhost/p/1')

      expect(postMessage).toHaveBeenCalledWith({
        action: 'cache-path',
        path: '/api/p/1',
        apiVersion: '10',
      })
    })
  })

  describe('waitForServiceWorker', () => {
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
