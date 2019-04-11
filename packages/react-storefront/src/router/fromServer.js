/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { fetchLatest, StaleResponseError } from '../fetchLatest'
import { abortPrefetches, resumePrefetches } from './serviceWorker'

let doFetch

/**
 * Fetch's state as json from the specified url
 * @param {String} url The url to fetch
 * @param {Object} options
 * @param {String} options.cache Set to "force-cache" to cache the response in the service worker.  Omit to skip the service worker cache.
 * @return {Object} A state patch
 */
export async function fetch(url, { cache = 'default' } = {}) {
  abortPrefetches()
  doFetch = doFetch || fetchLatest(require('isomorphic-unfetch'))

  const { href } = location

  try {
    const apiVersion = (window.moov || {}).apiVersion
    const result = await doFetch(url, {
      cache: cache || 'default',
      credentials: 'include',
      headers: {
        'x-react-storefront': 'true', // allows back end handlers to quickly identify PWA API requests,
        'x-moov-api-version': apiVersion, // needed for the service worker to determine the correct runtime cache name and ensure that we're not getting a cached response from a previous api version
      },
    }).then(response => {
      const { redirected, url } = response

      if (redirected) {
        redirectTo(url)
      } else {
        resumePrefetches()
        return response.json()
      }
    })

    if (result != null && location.href === href) {
      // Make sure the user hasn't changed the page since the request was sent.
      // If they have the response is stale and shouldn't be used.
      // We can get here when switching back to a page that is cached in the DOM by Pages
      return { loading: false, ...result }
    }
  } catch (e) {
    if (StaleResponseError.is(e)) {
      return null
    } else {
      throw e
    }
  }
}

/**
 * Handles a redirect response.  Will do a client side navigation if the URL has the same hostname as the app, otherwise will
 * reload the page.
 * @param {String} url
 */
function redirectTo(url) {
  if (url) {
    const parsed = new URL(url)
    const { history } = window.moov

    if (parsed.hostname === window.location.hostname) {
      history.push(parsed.pathname + parsed.search)
    } else {
      window.location.assign(url)
    }
  } else {
    throw new Error('Received a redirect without a location header.')
  }
}

/**
 * Creates a handler that fetches data from the server.
 *
 * The `handlerPath` should point to a module that exports a function that takes params, request, and response,
 * and returns an object that should be applied to the app state.  For example:
 *
 *  // routes.js
 *  router.get('/p/:id'
 *    fromServer('./product/product-handler')
 *  )
 *
 *  // product/product-handler.js
 *  export default function productHandler(params, request, response) {
 *    return fetchFromUpstreamApi(`/products/${params.id}`)
 *      .then(res => res.json())
 *      .then(productData => ({ // the shape of this object should match your AppModel
 *        page: 'Product',
 *        product: productData
 *      }))
 *  }
 *
 * When the request path ends in ".json", the json response will be returned verbatim.  In all other cases, server-side rendered HTML
 * will be returned.
 *
 * You can also send a verbatim string response using `response.send(body)`.  For example:
 *
 *  // routes.js
 *  router.get('/my-api'
 *    fromServer('./my-api-handler')
 *  )
 *
 *  // my-api-handler.js
 *  export default function myApiHandler(params, request, response) {
 *    response
 *      .set('content-type', response.JSON)
 *      .send(JSON.stringify({ foo: 'bar' }))
 *  }
 *
 * When `response.send()` is called in a handler, react-storefront will never perform server-side rendering.
 *
 * @param {String} handlerPath The path to the module that exports a handler function that returns state to apply
 * @param {Function} getURL An optional function that returns the back end url to call when fetching.  You only need
 *   to specify this if you want to override the default URL.
 * @return {Function}
 */
export default function fromServer(handlerPath, getURL) {
  return {
    type: 'fromServer',
    runOn: {
      server: true,
      client: true, // fromServer handlers run on the client too - we make an ajax request to get the state from the server
    },
    fn: async function(params, request, response) {
      if (typeof handlerPath === 'string') {
        let url = `${location.pathname}.json${location.search}`

        if (getURL) {
          url = getURL(url)
        }

        // handler path has not been transpiled, fetch the data from the server and return the result.
        return fetch(url, { cache: response.clientCache })
      } else {
        if (handlerPath == null)
          throw new Error(
            'You must provide a path to a handler in fromServer().  Please check your routes.',
          )

        // indicate handler path and asset class in a response header so we can track it in logs
        response.set('x-rsf-handler', handlerPath.path)
        response.set('x-rsf-response-type', request.path.endsWith('.json') ? 'json' : 'ssr')

        // handler path has been transpiled to a function
        return handlerPath(params, request, response)
      }
    },
  }
}
