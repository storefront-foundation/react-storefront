/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Removes headers that can interfere with varnish properly caching the response as directed
 */
function removeCacheHeadersForVarnish() {
  headers.removeAllHeaders("Age")
  headers.removeAllHeaders("Via")
  headers.removeAllHeaders("Expires")
}

/**
 * Instructs varnish to cache the response.
 * @param {String} header The value for the cache-control header
 */
function cache(header) {
  if (env.sa)
  removeCacheHeadersForVarnish()
  headers.header("Cache-Control", header)
  headers.header("X-Moov-Cache", header === 'no-cache' ? 'false' : 'true')
}

/**
 * Returns true if the request is a post from an amp page, otherwise false
 * @return {Boolean}
 */
function isAmpPost() {
  const referer = JSON.parse(env.headers).referer

  return (
    referer && 
    referer.split('?')[0].endsWith('.amp') &&
    env.method === 'post'
  )
}

/**
 * Sends an http redirect.
 * @param {String} url The destination url.  Can be relative or absolute.
 * @param {Number} statusCode The status code to send.  Defaults to 301
 */
function redirectTo(url, statusCode=301) {
  if (!url.match(/https?:\/\//)) {
    url = `https://${env.host}${url}`
  }

  if (isAmpPost()) {
    headers.addHeader("amp-redirect-to", url)
    headers.addHeader("access-control-expose-headers", "AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To")
    headers.addHeader("amp-access-control-allow-source-origin", "https://" + env.host)
  } else {
    headers.removeAllHeaders("Location")
    headers.addHeader("Location", url)
    headers.statusCode = statusCode.toString()
  }

  headers.header("Cache-Control", "no-cache")
}

function redirectToHttps() {
  redirectTo(`https://${env.host}${env.path}`)
}

/**
 * Run this in moov_response_header_transform.js
 */
export default function responseHeaderTransform() {

  if (env.__static_origin_path__) {
    // It is important that the client never caches the servce-worker so that it always goes to the network
    // to check for a new one.
    if (env.path.startsWith('/service-worker.js')) {
      cache('no-cache, s-maxage=290304000')
    } else {
      cache('maxage=290304000')
    }
  } else {
    // Always redirect on non-secure requests.

    if (env.secure !== 'true') {
      return redirectToHttps()   
    }

    // This gives us a mechanism to set cookies on adapt pages

    if (env.SET_COOKIE) {
      headers.addHeader("set-cookie", env.SET_COOKIE)
    }

    // far future cache the service worker on the server

    headers.addHeader('x-moov-api-version', __webpack_hash__)

    // set headers and status from Response object

    let response = env.MOOV_PWA_RESPONSE

    if (response) {
      headers.statusCode = response.statusCode
      headers.statusText = response.statusText

      // send headers
      for (let name in response.headers) {
        const value = response.headers[name]

        if (name.toLowerCase() === 'cache-control') {
          cache(value)
        } else {
          headers.addHeader(name, value)
        }
      }

      // set cookies
      for (let cookie of response.cookies) {
        headers.addHeader('set-cookie', cookie)
      }
      
      // handle redirects
      if (response.redirectTo) {
        redirectTo(response.redirectTo, headers.statusCode)
      }
    }
  }

  // never cache responses with an error status or temporary redirect
  if (headers.statusCode >= 400 || headers.statusCode === 302) {
    headers.removeHeader('cache-control')
  }
}