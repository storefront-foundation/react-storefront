/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { CLOUDFRONT_CACHE, XDN_VERSION } from '../router/headers'
import querystring from 'querystring'

export default function addCacheKeys(router, event, context, callback) {
  return buildCacheKeys => {
    const isAtEdge = !!event.Records

    function setHeader(request, key, value) {
      request.headers[key] = isAtEdge
        ? [
            {
              key,
              value
            }
          ]
        : value
    }

    const request = isAtEdge ? event.Records[0].cf.request : event
    const { match, params } = router.findMatchingRoute(request)
    const version = __build_timestamp__ // eslint-disable-line

    let cacheKey = buildCacheKeys(match, params, request, context)
    if (!cacheKey || !cacheKey.length) {
      // Might need a better default
      cacheKey = [request.path, querystring.stringify(request.queryStringParameters || {}), version]
    }

    setHeader(request, CLOUDFRONT_CACHE, encodeURIComponent(cacheKey.join('|')))
    setHeader(request, XDN_VERSION, version)

    callback(null, request)
  }
}
