/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Strips the protocol and hostname from the URL, returning a relative URL.
 * @param {String} url An absolute or relative URL 
 * @return {String} A relative URL
 */
export function relativeURL(url) {
  if (url == null) {
    return null
  } else {
    url = url.replace(/^(https?:)?\/\/[^\/]*/, '')
    if (url.length === 0) url = '/'
    return url
  }
}

const cleanProtocol = protocol => (protocol || '').replace(/:/, '')

/**
 * Creates an absolute URL for the given URL
 * @param {String} url A relative URL
 * @param {LocationModel} currentLocation The current browser location
 * @return {String} An absolute URL
 */
export function absoluteURL(url, currentLocation) {
  if (url == null) {
    return null 
  } else if (currentLocation == null) {
    return url
  } else if (url.match(/^(mailto|tel):/)) {
    return url
  } else if (url.match(/^\/\//)) {
    // URL with hostname but no protocol (starting with //)
    return `${cleanProtocol(currentLocation.protocol)}:${url}`
  } else if (!url.match(/^https?:/)) {
    // relative URL
    if (!url.match(/^\//)) {
      // URL is relative to current path
      url = `${currentLocation.pathname}/${url}`
    }

    let { port } = currentLocation

    if (port === '80' || port === '443') {
      port = ''
    } else {
      port = ':' + port
    }

    return `${cleanProtocol(currentLocation.protocol)}://${currentLocation.hostname}${port}${url}`
  } else {
    return url
  }
}

/**
 * Returns true if a URL can be navigated to on the client using history.push
 * @param {String} url The URL to check
 * @param {String} router The router 
 * @return {Boolean}
 */
export function canUseClientSideNavigation(url, router) {
  if (!url) return false
  
  // return false for non-webpage links
  if (url.match(/^(mailto|tel):/)) return false

  // return false for hash links
  if (url.match(/^#/)) return false

  // return false for absolute URLs
  if (url.match(/^(http|https)?:?\/\//)) return false

  // check if there is a proxyUpstream handler on the corresponding route
  if (router && router.willNavigateToUpstream(url)) return false

  return true
}