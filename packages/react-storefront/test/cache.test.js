import { clearClientCache } from '../src/cache'

describe('clearClientCache', () => {
  beforeEach(() => {
    global.caches = {
      keys: () => ['html', 'json', 'workbox-precache'],
      delete: jest.fn()
    }
  })

  it('should post a clear-cache record to the service worker', async () => {
    await clearClientCache()

    expect(global.caches.delete).toHaveBeenCalledTimes(2)
    expect(global.caches.delete).toHaveBeenCalledWith('html')
    expect(global.caches.delete).toHaveBeenCalledWith('json')
  })
})
