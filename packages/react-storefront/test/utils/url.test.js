/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { absoluteURL, relativeURL, canUseClientSideNavigation } from '../../src/utils/url'

describe('url', () => {
  let currentLocation

  beforeEach(() => {
    currentLocation = { protocol: 'https', hostname: 'example.com', port: '443' }
  })

  describe('absoluteURL', () => {
    it('should return null when no url is passed', () => {
      expect(absoluteURL(null)).toBe(null)
      expect(absoluteURL(undefined)).toBe(null)
    })

    it('should add protocol and hostname', () => {
      expect(absoluteURL('/foo/bar', currentLocation)).toBe('https://example.com/foo/bar')
    })

    it('should include the port when the port is not 443 or 80', () => {
      currentLocation.port = '8080'
      expect(absoluteURL('/foo/bar', currentLocation)).toBe('https://example.com:8080/foo/bar')
    })

    it('should return the same url when the url starts with tel: or mailto:', () => {
      expect(absoluteURL('mailto:user@domain.com', currentLocation)).toBe('mailto:user@domain.com')
      expect(absoluteURL('tel:1111111111', currentLocation)).toBe('tel:1111111111')
    })

    // Since it is common that protocol is given with colon
    // Source: https://www.npmjs.com/package/url-parse
    it('should handle protocol with colon if given', () => {
      currentLocation.protocol = 'https:'
      expect(absoluteURL('/foo/bar', currentLocation)).toBe('https://example.com/foo/bar')
    })
  })

  describe('relativeURL', () => {
    it('should return null when no url is passed', () => {
      expect(relativeURL(null)).toBe(null)
      expect(relativeURL(undefined)).toBe(null)
    })

    it('should strip protocol and hostname', () => {
      expect(relativeURL('https://example.com/foo/bar')).toBe('/foo/bar')
      expect(relativeURL('http://example.com/foo/bar')).toBe('/foo/bar')
    })

    it('should strip protocol and hostname', () => {
      expect(relativeURL('//example.com/foo/bar')).toBe('/foo/bar')
    })

    it('should return / when no path is supplied', () => {
      expect(relativeURL('http://example.com')).toBe('/')
    })

    it('should handle relative urls', () => {
      expect(relativeURL('/')).toBe('/')
      expect(relativeURL('/foo')).toBe('/foo')
      expect(relativeURL('/foo/bar')).toBe('/foo/bar')
      expect(relativeURL('foo')).toBe('foo')
    })
  })

  describe('canUseClientSideNavigation', () => {
    it('should return false when a url starts with tel: or mailto:', () => {
      expect(canUseClientSideNavigation('mailto:user@domain.com')).toBe(false)
      expect(canUseClientSideNavigation('tel:1111111111')).toBe(false)
    })

    it('should return false when a url starts with #', () => {
      expect(canUseClientSideNavigation('#foo')).toBe(false)
      expect(canUseClientSideNavigation('#/foo/bar')).toBe(false)
    })

    it('should return false for absolute urls', () => {
      expect(canUseClientSideNavigation('http://foo.com')).toBe(false)
      expect(canUseClientSideNavigation('https://foo.com')).toBe(false)
      expect(canUseClientSideNavigation('//foo.com')).toBe(false)
    })

    it('should return true for relative urls', () => {
      expect(canUseClientSideNavigation('/foo')).toBe(true)
      expect(canUseClientSideNavigation('/foo/bar')).toBe(true)
      expect(canUseClientSideNavigation('foo/bar')).toBe(true)
    })
  })
})