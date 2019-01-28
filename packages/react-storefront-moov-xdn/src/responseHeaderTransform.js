/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { cache, cacheProxiedAssets as doCacheProxiedAssets, FAR_FUTURE, ONE_DAY } from './cache'
import { redirectTo, redirectToHttps } from './redirect'

/**
 * Run this in moov_response_header_transform.js
 */
export default function responseHeaderTransform({ 
  cacheProxiedAssets={ serverMaxAge: ONE_DAY } 
} = {}) {

  if (env.__static_origin_path__) {
    headers.header('x-rsf-response-type', 'static')
    
    // It is important that the client never caches the servce-worker so that it always goes to the network
    // to check for a new one.
    if (env.path.startsWith('/service-worker.js')) {
      // far future cache the service worker on the server
      cache({ browserMaxAge: 0, serverMaxAge: FAR_FUTURE })
    } else if (env.path.startsWith('/pwa')) {
      cache({ browserMaxAge: FAR_FUTURE, serverMaxAge: FAR_FUTURE })
    } else {
      cache({ serverMaxAge: FAR_FUTURE })
    }
  } else {
    const [pathname] = env.path.split(/\?/)

    doCacheProxiedAssets(pathname, cacheProxiedAssets)

    // Always redirect on non-secure requests.

    if (env.secure !== 'true') {
      return redirectToHttps()   
    }

    addSecureHeaders()

    // This gives us a mechanism to set cookies on adapt pages

    if (env.SET_COOKIE) {
      headers.addHeader("set-cookie", env.SET_COOKIE)
    }

    headers.addHeader('x-moov-api-version', __webpack_hash__)

    // set headers and status from Response object

    let response = env.MOOV_PWA_RESPONSE

    if (response) {
      headers.statusCode = response.statusCode
      
      if (response.statusText) {
        headers.statusText = response.statusText
      }

      // set by cache route handlers
      if (response.cache) {
        cache(response.cache)
      }

      // send headers
      for (let name in response.headers) {
        headers.addHeader(name, response.headers[name])
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
    headers.removeAllHeaders('cache-control')
  }

  // Never send a set-cookie header when x-moov-cache is set to true.  
  // Doing so would prevent caching as varnish will not cache a response with a set-cookie header.
  if (headers.header('x-moov-cache')) {
    headers.removeAllHeaders('set-cookie')
  }

}

function addSecureHeaders() {
  // prevents clickjacking, also known as a "UI redress attack"
  headers.header('X-Frame-Options', 'SAMEORIGIN')
  headers.header('Referrer-Policy', 'no-referrer-when-downgrade')
}