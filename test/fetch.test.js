describe('fetch', () => {
  const originalXHR = XMLHttpRequest
  let fetch, mockUnfetch, mockSetRequestHeader, originalWindow

  afterEach(() => {
    global.XMLHttpRequest = originalXHR
    global.window = originalWindow
  })

  describe('in browser', () => {
    beforeEach(() => {
      jest.isolateModules(() => {
        mockUnfetch = jest.fn()
        jest.mock('isomorphic-unfetch', () => mockUnfetch)
        mockSetRequestHeader = jest.fn()

        global.XMLHttpRequest = class XHR {
          open() {}
          setRequestHeader = mockSetRequestHeader
        }

        fetch = require('react-storefront/fetch').default
      })
    })

    it('should send x-rsf-api-version', () => {
      fetch('test')
      expect(mockUnfetch).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          headers: expect.objectContaining({
            'x-rsf-api-version': expect.any(String),
          }),
        }),
      )
    })

    it('should preserve existing headers', () => {
      fetch('test', { headers: { foo: 'bar' } })

      expect(mockUnfetch).toHaveBeenCalledWith(
        'test',
        expect.objectContaining({
          headers: expect.objectContaining({
            foo: 'bar',
            'x-rsf-api-version': expect.any(String),
          }),
        }),
      )
    })

    it('should monkey patch window.fetch', () => {
      expect(window.fetch).toBe(fetch)
    })

    it('should send x-rsf-api-version with all xhr', () => {
      const request = new XMLHttpRequest()
      request.open('GET', 'http://localhost:3000')
      expect(mockSetRequestHeader).toHaveBeenCalledWith('x-rsf-api-version', expect.any(String))
    })
  })

  describe('on server', () => {
    it('should not require XMLHttpRequest to be present', () => {
      jest.isolateModules(() => {
        global.XMLHttpRequest = undefined
        expect(() => require('react-storefront/fetch').default).not.toThrowError()
      })
    })

    it('should work on the server', () => {
      jest.isolateModules(() => {
        global.window = undefined
        expect(() => require('react-storefront/fetch').default).not.toThrowError()
      })
    })
  })
})
