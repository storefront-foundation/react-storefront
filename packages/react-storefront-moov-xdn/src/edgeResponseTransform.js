/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

/**
 * Helper for moov_edge_response_transform.js
 */
export default function edgeResponseTransform() {
  if (env.behindOuterEdge === 'false') { // this is set in requestHeaderTransform.js
    removeSMaxAge()
  } 
}

/**
 * Remove the s-maxage response header so it won't be used by any upstream optimizer or CDN, 
 * which could lead to stale data in a cache that wouldn't automatically be cleared on deploy.
 */
function removeSMaxAge() {
  let cacheControl = headers.header('Cache-Control')

  if (cacheControl != null) {
    cacheControl = cacheControl.replace(/(,\s*)?s-maxage=[^\s]+$/i, '')
    headers.header('Cache-Control', cacheControl)
  }
}
