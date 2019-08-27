describe('fetch.common', () => {
  it('should export fetch', () => {
    const fetch = require('../src/fetch').default
    expect(require('../src/fetch.common')).toBe(fetch)
  })
})
