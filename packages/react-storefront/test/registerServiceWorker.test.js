import { getServiceWorkerURL } from '../src/registerServiceWorker'

describe('registerServiceWorker', () => {
  describe('getServiceWorkerURL', () => {
    it('should contain the mode id and use the public_url', () => {
      process.env.PUBLIC_URL = 'https://www.site.com'
      window.moov = {
        state: {
          mode: {
            id: 'a',
            name: 'Mode A'
          }
        }
      }
      expect(getServiceWorkerURL()).toEqual(
        'https://www.site.com/service-worker.js?moov_fetch_from=a'
      )
    })
  })
})
