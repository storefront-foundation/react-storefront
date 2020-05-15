import addVersion from '../../src/api/addVersion'

describe('addVersion', () => {
  beforeEach(() => {
    window.__NEXT_DATA__ = {
      buildId: 'development',
    }
  })

  afterEach(() => {
    delete window.__NEXT_DATA__
  })

  it('should add the version query param', () => {
    expect(addVersion('/foo').toString()).toBe('http://localhost/foo?__v__=development')
  })

  it('should not duplicate the version query param', () => {
    expect(addVersion('/foo?__v__=1').toString()).toBe('http://localhost/foo?__v__=1')
  })

  it('should leave the original hostname intact', () => {
    expect(addVersion('http://foo.com/foo').toString()).toBe('http://foo.com/foo?__v__=development')
  })
})
