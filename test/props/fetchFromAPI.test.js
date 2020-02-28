import fetchFromAPI from 'react-storefront/props/fetchFromAPI'

describe('fetchFromAPI', () => {
  let headers

  fetchMock.mockResponse(JSON.stringify({}))

  describe('in the browser', () => {
    beforeEach(() => {
      headers = {
        'x-rsf-api-version': '1',
      }
    })

    it('should prepend api to the path', () => {
      fetchFromAPI({
        asPath: '/p/1',
      })
      expect(fetchMock).toHaveBeenCalledWith('/api/p/1', { headers })
    })

    it('should call /api when the path is /', () => {
      fetchFromAPI({
        asPath: '/',
      })
      expect(fetchMock).toHaveBeenCalledWith('/api', { headers })
    })

    it('should append query params directly to api if the root with query params is called', () => {
      fetchFromAPI({
        asPath: '/?test=1',
      })
      expect(fetchMock).toHaveBeenCalledWith('/api?test=1', { headers })
    })
  })

  describe('on the server', () => {
    beforeEach(() => {
      headers = {
        'x-rsf-api-version': '1',
        host: 'www.domain.com',
      }
    })

    it('should include the protocol, domain, and ?_includeAppData=1', () => {
      fetchFromAPI({
        asPath: '/p/1',
        pathname: '/p/[productId]',
        req: {
          headers: {
            host: 'www.domain.com',
          },
        },
      })
      expect(fetchMock).toHaveBeenCalledWith('https://www.domain.com/api/p/1?_includeAppData=1', {
        headers: {
          ...headers,
          'x-next-page': '/api/p/[productId]',
        },
      })
    })

    it('should use API_HOST when provided', () => {
      process.env.API_HOST = 'localhost:3001'

      fetchFromAPI({
        asPath: '/p/1',
        pathname: '/p/[productId]',
        req: {
          headers: {
            host: 'www.domain.com',
          },
        },
      })

      expect(fetchMock).toHaveBeenCalledWith('http://localhost:3001/api/p/1?_includeAppData=1', {
        headers: {
          ...headers,
          'x-next-page': '/api/p/[productId]',
        },
      })

      delete process.env.API_HOST
    })

    it('should use http:// for localhost', () => {
      fetchFromAPI({
        asPath: '/p/1',
        pathname: '/p/[productId]',
        req: {
          headers: {
            ...headers,
            host: 'localhost',
          },
        },
      })
      expect(fetchMock).toHaveBeenCalledWith('http://localhost/api/p/1?_includeAppData=1', {
        headers: {
          ...headers,
          host: 'localhost',
          'x-next-page': '/api/p/[productId]',
        },
      })
    })

    it('should append _includeAppData to the existing query string', () => {
      fetchFromAPI({
        asPath: '/foo?x=1',
        pathname: '/foo',
        req: {
          headers,
        },
      })
      expect(fetchMock).toHaveBeenCalledWith(
        'https://www.domain.com/api/foo?x=1&_includeAppData=1',
        {
          headers: {
            ...headers,
            'x-next-page': '/api/foo',
          },
        },
      )
    })
  })
})
