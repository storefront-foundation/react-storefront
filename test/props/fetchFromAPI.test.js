describe('fetchFromAPI', () => {
  let fetchFromAPI,
    isBrowser = true

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.doMock('react-storefront/utils/isBrowser', () => () => isBrowser)
      fetchFromAPI = require('react-storefront/props/fetchFromAPI').default
    })
  })

  describe('in the browser', () => {
    beforeEach(() => {
      isBrowser = true
    })

    it('should prepend api to the path', () => {
      fetchFromAPI({
        asPath: '/p/1',
      })
      expect(global.fetch).toHaveBeenCalledWith('/api/p/1')
    })

    it('should call /api when the path is /', () => {
      fetchFromAPI({
        asPath: '/',
      })
      expect(global.fetch).toHaveBeenCalledWith('/api')
    })
  })

  describe('on the server', () => {
    beforeEach(() => {
      isBrowser = false
    })

    it('should include the protocol, domain, and ?_includeAppData=1', () => {
      fetchFromAPI({
        asPath: '/p/1',
        req: {
          headers: {
            host: 'www.domain.com',
          },
        },
      })
      expect(global.fetch).toHaveBeenCalledWith('https://www.domain.com/api/p/1?_includeAppData=1')
    })

    it('should use http:// for localhost', () => {
      fetchFromAPI({
        asPath: '/p/1',
        req: {
          headers: {
            host: 'localhost',
          },
        },
      })
      expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/p/1?_includeAppData=1')
    })

    it('should append _includeAppData to the existing query string', () => {
      fetchFromAPI({
        asPath: '/foo?x=1',
        req: {
          headers: {
            host: 'localhost',
          },
        },
      })
      expect(global.fetch).toHaveBeenCalledWith('http://localhost/api/foo?x=1&_includeAppData=1')
    })
  })
})
