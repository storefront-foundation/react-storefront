/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { RESPONSE_TYPE, HANDLER } from './headers'

// The default callback used when none is provided.  Simply returns the upstream HTML unaltered.
const perfectProxy = (_params, _request, response) => response.send()

/**
 * A handler that fetches HTML from the same path as the current request on the upstream site. Use
 * this handler to transform HTML from the upstream site or return it unaltered.
 * To relay the response from the upstream site unaltered, call `response.send()` with no arguments.
 *
 * Example - Using a handler to transform the HTML from the proxied site:
 *
 * ```js
 * // src/routes.js
 * import { Router, proxyUpstream } from 'react-storefront/router'
 *
 * export default new Router()
 *   .get('/some-page',
 *     proxyUpstream('./proxy/proxy-handler')
 *   )
 * ```
 *
 * ```js
 * // src/proxy/proxy-handler.js
 * import getStats from 'react-storefront-stats'
 *
 * export default async function proxyHandler(params, request, response) {
 *   const contentType = global.env.content_type || ''
 *
 *   if (contentType.indexOf('html') > -1) {
 *     const stats = await getStats()
 *     fns.init$(body)
 *
 *     // ... alter the response HTML received from the upstream site here by calling functions on $. ...
 *
 *     response.send($.html())
 *   } else {
 *     response.send()
 *   }
 * }
 * ```
 *
 * Example - returning the HTML from the upstream site unaltered:
 *
 * ```js
 * // src/routes.js
 * import { Router, proxyUpstream } from 'react-storefront/router'
 *
 * export default new Router()
 *   .get('/some-page',
 *     proxyUpstream()
 *   )
 * ```
 *
 * @param {Function} cb A function to call after the response has been received from the upstream site.
 * @param {Object} cb.params Request parameters parsed from the route and query string
 * @param {Request} cb.request An object representing the request
 * @param {Response} cb.response An object representing the response.  Call `response.send(html)` to send the resulting html back to the browser.
 */
export default function proxyUpstream(cb = perfectProxy) {
  return {
    type: 'proxyUpstream',
    runOn: {
      server: true,
      client: true
    },
    fn: async (params, request, response) => {
      if (process.env.MOOV_RUNTIME === 'client') {
        // reload the page if this handler is called during client-side navigation
        window.location.reload()
      } else {
        if (cb == null)
          throw new Error(
            'You must provide a path to a handler in proxyUpstream().  Please check your routes.'
          )
        // indicate handler path and asset class in a response header so we can track it in logs
        response.set(HANDLER, cb.path)
        response.set(RESPONSE_TYPE, 'proxy')
        return (await cb(params, request, response)) || { proxyUpstream: true }
      }
    }
  }
}
