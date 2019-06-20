import powerLinkHandler from '../../src/router/powerLinkHandler'
import Response from '../../../react-storefront-moov-xdn/src/Response'

describe('powerLinkHandler', () => {
  let response
  let request

  beforeEach(() => {
    global.env = {}
    global.fns = {
      export: () => {}
    }
    request = {
      sendResponse: jest.fn()
    }
    response = new Response(request)
  })

  describe('powerLinkHandler', () => {
    it('should set response content type to javascript', () => {
      powerLinkHandler(null, {}, response)
      expect(response.get('content-type')).toBe('application/javascript')
    })
    it('should cache', () => {
      powerLinkHandler(null, {}, response)
      expect(response.get('x-moov-cache')).toBe('true')
    })
    it('should set cache age', () => {
      powerLinkHandler(null, {}, response)
      expect(response.get('cache-control')).toBe('max-age: 86400, s-maxage: 31536000')
    })
    it('should set service worker path in body', () => {
      powerLinkHandler(
        null,
        {
          protocol: 'https:',
          hostname: 'test.com',
          port: 443
        },
        response
      )
      expect(request.sendResponse).toMatchSnapshot()
    })
  })
})
