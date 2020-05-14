describe('fetch', () => {
  let f, fetch, originalOpen, originalFetch

  beforeEach(() => {
    jest.isolateModules(() => {
      f = jest.fn()
      jest.doMock('isomorphic-unfetch', () => f)
      originalOpen = jest.spyOn(XMLHttpRequest.prototype, 'open')
      originalFetch = jest.spyOn(window, 'fetch').mockImplementation()
      fetch = require('../src/fetch').default
      window.__NEXT_DATA__ = {
        buildId: 'development',
      }
    })
  })

  afterEach(() => {
    delete window.__NEXT_DATA__
  })

  it('should export isomorphic-unfetch for backwards compatibility', () => {
    fetch('/foo')
    expect(f).toHaveBeenCalledWith('/foo')
  })

  it('should patch window.fetch', () => {
    window.fetch('/foo')
    expect(originalFetch).toHaveBeenCalledWith('http://localhost/foo?__v__=development', undefined)
  })

  it('should add the version to XMLHttpRequest.open', () => {
    const req = new XMLHttpRequest()
    req.open('GET', '/foo')
    expect(originalOpen).toHaveBeenCalledWith('GET', 'http://localhost/foo?__v__=development')
  })
})
