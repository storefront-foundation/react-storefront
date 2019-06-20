import fetch from '../src/fetch'

describe('fetch.common', () => {
  it('should export fetch', () => {
    const fetch = expect(require('../src/fetch')).default
    expect(require('../src/fetch.common')).toBe(fetch)
  })
})
