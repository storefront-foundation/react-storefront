describe('fetch', () => {
  const mockSetRequestHeader = jest.fn()
  let fetch

  afterAll(() => {
    jest.restoreAllMocks()
  })

  beforeAll(() => {
    fetchMock.mockResponse(JSON.stringify({}))

    jest
      .spyOn(XMLHttpRequest.prototype, 'setRequestHeader')
      .mockImplementation(mockSetRequestHeader)
  })

  describe('in browser', () => {
    beforeAll(() => {
      jest.isolateModules(() => {
        fetch = require('react-storefront/fetch').default
      })
    })

    it('should send x-rsf-api-version', () => {
      fetch('test')
      expect(fetchMock).toHaveBeenCalledWith(
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

      expect(fetchMock).toHaveBeenCalledWith(
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
    beforeAll(() => {
      jest.spyOn(global, 'window', 'get').mockImplementation(() => undefined)
      jest.isolateModules(() => {
        fetch = require('react-storefront/fetch').default
      })
    })

    it('should work on the server', async () => {
      const fetchMockRes = { test: 'test' }

      fetchMock.mockResponseOnce(JSON.stringify(fetchMockRes))

      const fetchRes = await fetch('test').then(res => res.json())

      expect(window).toBe(undefined)
      expect(fetchRes).toStrictEqual(fetchMockRes)
    })
  })

  describe('window is defined but window fetch is not defined', () => {
    beforeAll(() => {
      jest.spyOn(global, 'window', 'get').mockImplementation(() => ({
        fetch: undefined,
      }))
      jest.isolateModules(() => {
        fetch = require('react-storefront/fetch').default
      })
    })

    it('should not overwrite it with our fetch', async () => {
      expect(window.fetch).toBe(undefined)
    })
  })
})
