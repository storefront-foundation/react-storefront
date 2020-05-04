describe('fetch', () => {
  let f, fetch

  beforeEach(() => {
    f = jest.fn()
    jest.doMock('isomorphic-unfetch', () => f)
    fetch = require('../src/fetch').default
  })

  it('should export isomorphic-unfetch for backwards compatibility', () => {
    fetch('/foo')
    expect(f).toHaveBeenCalledWith('/foo')
  })
})
