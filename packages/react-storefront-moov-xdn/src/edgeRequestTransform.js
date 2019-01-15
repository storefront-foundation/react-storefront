/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Request from './Request'

/**
 * Helper for moov_edge_request_transform.js
 * @param {Object} options
 * @param {Function} options.setCacheKey A function to register a callback to set a cache key for the current request.
 * @param {Router} options.router The app's router
 */
export default function edgeRequestTransform({ setCacheKey, router }) {
  // Here we support custom server cache keys via server.key in cache route handlers.
  setCacheKey(defaults => {
    const request = new Request()
    return router.getCacheKey(request, defaults)
  })
}