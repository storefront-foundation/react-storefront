/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
// The default callback used when none is provided.  Simply returns the upstream HTML unaltered.
const perfectProxy = (_params, _request, response) => response.send()

/**
 * A handler that fetches HTML from the same path as the current request on the upstream site. Use
 * this handler to transform HTML from the upstream site or return it unaltered.
 *   
 * The callback you provide is passed the following arguments:
 * 
 * params {Object} Request parameters parsed from the route and query string
 * request {Object} An object representing the request
 * response {Response} An object representing the response.  Call response.send(html) to send the resulting html back to the browser.
 * 
 * To use response from the upstream site unaltered, called response.send() with no arguments.
 * 
 * @param {Function} cb A callback which takes params, request, and response.
 */
export default function proxyUpstream(cb=perfectProxy) {
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
        if (cb == null) throw new Error('You must provide a path to a handler in proxyUpstream().  Please check your routes.')
        // indicate handler path and asset class in a response header so we can track it in logs
        response.set('x-rsf-handler', cb.path)
        response.set('x-rsf-response-type', 'proxy')
        return await cb(params, request, response) || { proxyUpstream: true }
      }
    }
  }
}