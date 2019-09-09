/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import Server from 'react-storefront/Server'
import Config from 'react-storefront/Config'
import Request from './Request'
import Response from './Response'
import './requestContext'

useMoovAsyncTransformer()

/**
 * Provides the default functionality for scripts/index.js
 * @param {Object} options
 * @param {Object} theme The material-ui theme
 * @param {Class} model A mobx-state-tree model class that extends AppModelBase
 * @param {React.Component} App The app react component
 * @param {Router} router An instance of react-storefront/router
 * @param {String} blob The blob
 * @param {Function} transform A function to transform the rendered HTML before it is sent to the browser
 * @param {Function} errorReporter A function to call when an error occurs so that it can be logged
 */
export default function responseRewriter({
  theme,
  model,
  App,
  router,
  blob,
  transform,
  errorReporter = Function.prototype
}) {
  if (env.secure !== 'true') {
    // Always redirect on non-secure requests.
    return sendResponse({ htmlparsed: false })
  } else if (env.__static_origin_path__) {
    // static assets
    fns.export('Cache', 'true')
    fns.export('Cache-Time', '2903040000') // static paths use hash-based cache-busting, so we far-future cache them in varnish and the browser
    return sendResponse({ htmlparsed: false })
  } else {
    // render the page
    Config.load(blob)

    const request = (env.rsf_request = new Request())
    const response = (env.rsf_response = new Response(request))

    new Server({ theme, model, App, router, transform, errorReporter }).serve(request, response)
  }
}
