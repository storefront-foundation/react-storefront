import { getCookie } from '../../src/utils/cookie'

describe('cookie', () => {
  describe('getCookie', () => {
    beforeEach(() => {
      document.cookie = 'rsf_foo=bar'
      document.cookie = 'rsf_bar=foo'
    })
    afterEach(() => {
      document.cookie = 'rsf_foo='
      document.cookie = 'rsf_bar='
    })
    it('should get the value of a cookie', () => {
      expect(getCookie('rsf_foo')).toBe('bar')
    })
    it('should handle a space in the cookie', () => {
      expect(getCookie('rsf_bar')).toBe('foo')
    })
    it('should return undefined when the cookie is not defined', () => {
      expect(getCookie('baz')).toBe(undefined)
    })
  })
})
