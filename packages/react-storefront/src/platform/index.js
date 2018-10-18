/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import Server from '../Server'
import Config from '../Config'

useMoovAsyncTransformer()

/**
 * Provides the default functionality for scripts/index.js
 * @param {Object} options
 * @param {Object} theme The material-ui theme
 * @param {Class} model A mobx-state-tree model class that extends AppModelBase 
 * @param {React.Component} App The app react component
 * @param {Router} router An instance of react-storefront/router
 * @param {String} blob The blob 
 */
export default function responseRewriter({ theme, model, App, router, blob }) {

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
    new Server({ theme, model, App, router }).serve()
  }

}
