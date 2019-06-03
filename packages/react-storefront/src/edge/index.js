/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { CLOUDFRONT_CACHE, XDN_VERSION } from '../router/headers'

export default function addCacheKey(router, event, context, callback) {
  return buildCacheKey => {
    const request = event.Records ? event.Records[0].cf.request : event
    const { match, params } = router.findMatchingRoute(request)

    request.headers[CLOUDFRONT_CACHE] = buildCacheKey(match, params, request, context)
    request.headers[XDN_VERSION] = __build_timestamp__ // eslint-disable-line

    callback(null, request)
  }
}
