import { redirectTo, redirectToHttps } from '../../src/platform/redirect'

describe('redirect', () => {
  describe('redirectTo', () => {
    describe('amp', () => {
      beforeEach(() => {
        global.headers = {
          header: jest.fn(),
          addHeader: jest.fn(),
          removeAllHeaders: jest.fn()
        }

        global.env = {
          method: 'post',
          headers: JSON.stringify({
            referer: '/.amp'
          }),
          host: 'www.example.com'
        }
      })

      afterEach(() => {
        delete global.env
        delete global.headers
      })

      it('should send amp-specific redirect headers', () => {
        redirectTo('/c/1')
        expect(headers.addHeader.mock.calls[0]).toEqual(['amp-redirect-to', 'https://www.example.com/c/1'])
        expect(headers.addHeader.mock.calls[1]).toEqual(['access-control-expose-headers', 'AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To'])
        expect(headers.addHeader.mock.calls[2]).toEqual(["amp-access-control-allow-source-origin", "https://www.example.com"])
      })
    })
  })

  describe('non-amp', () => {
    beforeEach(() => {
      global.headers = {
        header: jest.fn(),
        addHeader: jest.fn(),
        removeAllHeaders: jest.fn()
      }

      global.env = {
        method: 'get',
        headers: JSON.stringify({
          referer: '/'
        }),
        host: 'www.example.com'
      }
    })

    afterEach(() => {
      delete global.env
      delete global.headers
    })

    it('should send location and status code', () => {
      redirectTo('/c/1')
      expect(headers.addHeader.mock.calls[0]).toEqual(['Location', 'https://www.example.com/c/1'])
      expect(headers.statusCode).toBe('301')
    })

    it('should send allow you to specify the status code', () => {
      redirectTo('/c/1', '302')
      expect(headers.addHeader.mock.calls[0]).toEqual(['Location', 'https://www.example.com/c/1'])
      expect(headers.statusCode).toBe('302')
    })
  })

  describe('redirectToHttps', () => {
    beforeEach(() => {
      global.headers = {
        header: jest.fn(),
        addHeader: jest.fn(),
        removeAllHeaders: jest.fn()
      }
      
      global.env = {
        host: 'www.example.com',
        path: '/c/1',
        headers: '{}'
      }
    })

    it('should redirect to the same URL but with https', () => {
      redirectToHttps()
      expect(headers.addHeader.mock.calls[0]).toEqual(['Location', 'https://www.example.com/c/1'])
      expect(headers.statusCode).toBe('301')
    })

    afterEach(() => {
      delete global.env
      delete global.headers
    })
  })
})