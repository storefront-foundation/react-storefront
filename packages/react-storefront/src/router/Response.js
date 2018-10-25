/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * The standard cache-control header value sent for all resources that are not to be cached.
 */
export const NO_CACHE_HEADER = 'no-store, no-cache, maxage=0'

/**
 * Represents the response sent back from fromServer handlers.  Use this class to set headers, status,
 * and other response metadata.
 */
export default class Response {

  redirectTo = null
  clientCache = 'default'
  shouldRelayUpstreamCookies = true
  sent = false

  /**
   * The application/json mime type
   */
  JSON = 'application/json'

  /**
   * The text/html mime type
   */
  HTML = 'text/html'

  headers = {
    // Send no-cache by default.  This can be overridden by adding a cache handler to any route.
    'cache-control': NO_CACHE_HEADER
  }

  cookies = []

  constructor(request) {
    this.request = request
    let headers = global.headers || { statusCode: 200, statusText: 'OK'}
    this.statusCode = headers.statusCode
    this.statusText = headers.statusText
  }

  /**
   * Sends response content
   * @param {String} body The body of the response
   * @return {Response} this
   */
  send(body) {
    this._doRelayUpstreamCookies()

    global.fns.export('MOOV_PWA_RESPONSE', {
      statusCode: this.statusCode,
      statusText: this.statusText,
      redirectTo: this.redirectTo,
      headers: this.headers, 
      cookies: this.cookies
    })

    this.request.sendResponse({ body, htmlparsed: body != null })
    this.sent = true
    return this
  }

  /**
   * Configure whether or not set-cookie headers from upstream should be sent down to the browser
   * @param {Boolean} shouldRelay True to relay upstream set-cookie headers to the browser, false to not
   */
  relayUpstreamCookies(shouldRelay) {
    this.shouldRelayUpstreamCookies = shouldRelay
    return this
  }

  /**
   * Relays all set-cookie headers received from fetch requests back to the browser, 
   * translating each to the current domain.
   * @private
   */
  _doRelayUpstreamCookies() {
    const cookiesByDomain = env.MUR_SET_COOKIES

    if (this.shouldRelayUpstreamCookies && cookiesByDomain) {
      for (let domain in cookiesByDomain) {
        for (let cookie of cookiesByDomain[domain]) {
          // add a cookie for the current request's domain (for projects that don't have a proper DNS entry, for example localhost or moveapp.com)
          cookie = cookie.replace(/Domain=[^;]*(;\s*|\s*$)/gi, '')
          const upstream = injectDomain(cookie, domain)
          const app = injectDomain(cookie, this.request.hostname)
          this.cookies.push(upstream)
          if (app !== upstream) this.cookies.push(cookie)
        }
      }
    }
  }
  
  /**
   * Sets a response header
   * @param {String} name
   * @param {String} value
   * @return {Response} this
   */
  set(name, value) {
    if (name == null) throw new Error('name cannot be null in call to response.set')
    this.headers[name] = value
    return this
  }

  /**
   * Gets the value of a header by name (case insensitive)
   * @param {String} name 
   * @return {String} The header value
   */
  get(name) {
    return this.headers[name.toLowerCase()]
  }

  /**
   * Sets the response status
   * @param {String} code 
   * @param {String} text 
   * @return {Response} this
   */
  status(code, text) {
    this.statusCode = code
    this.statusText = text
    return this
  }

  /**
   * Controls caching in the service worker
   * @param {Boolean} shouldCache Set to true to cache the response on the client
   * @return {Response} this
   */
  cacheOnClient(shouldCache) {
    if (shouldCache == null) throw new Error('shouldCache cannot be null in call to response.cacheOnClient')
    this.clientCache = shouldCache ? 'force-cache' : 'default'
    return this
  }

  /**
   * Caches the response on the server
   * @param {Number} maxAgeSeconds The time the entry should live in the cache in seconds
   * @return {Response} this
   */
  cacheOnServer(maxAgeSeconds) {
    if (maxAgeSeconds == null) throw new Error('maxAgeSeconds cannot be null in call to response.cacheOnServer')
    this.set('cache-control', `${NO_CACHE_HEADER}, s-maxage=${maxAgeSeconds}`)
    return this
  }

  /**
   * Sends a redirect to the specified URL
   * @param {String} url A url
   * @param {Number} status The http status code to send
   * @return {Response} this
   */
  redirect(url, status=301) {
    if (url == null) throw new Error('url cannot be null in call to response.redirect')
    this.redirectTo = url
    this.statusCode = status
    return this
  }

}

/**
 * Injects a domain into a set-cookie header
 * @param {String} cookie 
 * @param {String} domain
 * @return {String} 
 */
function injectDomain(cookie, domain) {
  const idx = cookie.indexOf(';') + 1
  return `${cookie.substr(0, idx)} Domain=${domain}; ${cookie.substr(idx).trim()}`
}