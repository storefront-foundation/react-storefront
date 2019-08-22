import { clearClientCache } from '../src/cache'

describe('clearClientCache', () => {
  beforeEach(() => {
    navigator.serviceWorker = {
      controller: {
        postMessage: jest.fn()
      },
      ready: Promise.resolve()
    }
  })

  it('should post a clear-cache record to the service worker', async () => {
    await clearClientCache()

    expect(navigator.serviceWorker.controller.postMessage).toHaveBeenCalledWith({
      action: 'clear-cache'
    })
  })
})
