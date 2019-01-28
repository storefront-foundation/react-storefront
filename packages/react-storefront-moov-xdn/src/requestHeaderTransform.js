/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Request from './Request'

/**
 * Helper for moov_request_header_transform.js
 * @param {Router} options.router The app's router
 * @param {String[]} options.hostDomains An array containing the single domains on which the app is hosted.  
 *  When a proxyUpstream handler is used on one of these domains, the framework will not send the host header as
 *  part of the upstream request.
 */
export default function requestHeaderTransform({ router, hostDomains=[] }) {
  if (env.__static_origin_path__) {
    // always go upstream for static paths
    return
  } else if (env.secure !== "true") {
    // don't bother going upstream if we're not using https, we're just going to redirect
    return moovSkipUpstream()
  } else {
    const request = new Request()
    fns.export('headers', JSON.stringify(request.headers))
    fns.export('behindOuterEdge', process.env.MOOV_ENV === 'development' || request.headers['x-moov-xdn-version'] == null ? 'false' : 'true') // needed in edgeResponseTransform.js
  
    if (router.willFetchFromUpstream(request)) {
      // Adapt route
      console.log('[react-storefront]', `going upstream for ${env.path}`)
      if (!hostDomains.includes(env.host)) {
        headers.header("host", env.source_host)
      }
    } else {
      // PWA route
      console.log('[react-storefront]', `rendering PWA for ${env.path}`)
      moovSkipUpstream()
    }
  }
}
