/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
const { cache, ONE_DAY } = require('./cache')
const { redirectToHttps } = require('./redirect')

const API_VERSION = 'x-moov-api-version'

const doCacheProxiedAssets = require('./cache').cacheProxiedAssets

/**
 * Run this in moov_response_header_transform.js
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 */
module.exports = function responseHeaderTransform(
  req,
  res,
  { cacheProxiedAssets = { serverMaxAge: ONE_DAY } } = {}
) {
  const [pathname] = req.path.split(/\?/)

  doCacheProxiedAssets(res, pathname, cacheProxiedAssets)

  // Always redirect on non-secure requests.
  if (req.secure !== 'true') {
    // TODO: turning off for development
    // return redirectToHttps(req, res)
  }

  addSecureHeaders(res)
  addCorsHeaders(res)

  const apiVersion =
    typeof __build_timestamp__ !== 'undefined' ? __build_timestamp__ : 'mock-version-string' // eslint-disable-line
  res.set(API_VERSION, apiVersion)

  // TODO:
  // Add cache to middleware Response (cacheOnServer)
  // set cache-control: private, no-store, no-cache, s-maxage={serverMaxAge}
  // if (res.cache) {
  //   cache(res, res.cache)
  // }

  // never cache responses with an error status or temporary redirect
  if (res.statusCode >= 400 || res.statusCode == 302) {
    res.removeHeader('cache-control')
  }

  // The browser should never cache rejected prefetches, otherwise it has the effect of
  // prefetching and storing an error.  The user will never be able to load that page.
  if (res.statusCode == 544) {
    res.set('cache-control', 'private, no-store, no-cache')
  }

  // Never send a set-cookie header when x-moov-cache is set to true.
  // Doing so would prevent caching as varnish will not cache a response with a set-cookie header.
  if (res.get('x-moov-cache')) {
    res.removeHeader('set-cookie')
  }
}

/**
 * Adds the Access-Control-Allow-Origin header needed for making requests from AMP
 * when the page is delivered from Google's cache.
 * See https://www.ampproject.org/docs/fundamentals/amp-cors-requests
 */
function addCorsHeaders(res) {
  const origin = res.get('origin')
  console.log('origin', origin)

  if (origin && origin.endsWith('cdn.ampproject.org')) {
    res.set('Access-Control-Allow-Origin', origin) // allow site to make requests when hosted from google's cache
    res.set('Access-Control-Allow-Credentials', 'true') // allow cookies to be sent in cross-origin requests
  }
}

function addSecureHeaders(res) {
  // prevents clickjacking, also known as a "UI redress attack"
  res.set('X-Frame-Options', 'SAMEORIGIN')
  res.set('Referrer-Policy', 'no-referrer-when-downgrade')
}
