import getAPIURL from '../../src/api/getAPIURL'

describe('getAPIURL', () => {
  beforeEach(() => {
    window.__NEXT_DATA__ = {
      buildId: '1',
    }
  })

  afterEach(() => {
    delete window.__NEXT_DATA__
  })

  it('should append __NEXT_DATA__.buildId to the query string', () => {
    expect(getAPIURL('/foo')).toBe('/api/foo?__v__=1')
  })

  it('should append __NEXT_DATA__.buildId to the existing query string', () => {
    expect(getAPIURL('/foo?test=1')).toBe('/api/foo?test=1&__v__=1')
  })

  it('should not append __NEXT_DATA__.buildId if __NEXT_DATA__ is undefined', () => {
    delete window.__NEXT_DATA__
    expect(getAPIURL('/foo')).toBe('/api/foo')
  })
})
