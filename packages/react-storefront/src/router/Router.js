/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Route from 'route-parser'
import isFunction from 'lodash/isFunction'
import qs from 'qs'
import merge from 'lodash/merge'
import cloneDeep from 'lodash/cloneDeep'
import { configureCache } from './serviceWorker'
import ClientContext from './ClientContext'
import EventEmitter from 'eventemitter3'
import powerLinkHandler from './powerLinkHandler'
import fromServer from './fromServer'

/**
 * Provides routing for MUR-based applications and PWAs.  This class is inspired by express and uses https://github.com/rcs/route-parser,
 * which supports sophisticated pattern matching including optional paths, params, and splatting.
 *
 * Example:
 *
 *  const router = new Router()
 *
 *  router.get('/products/:id', ({ id }) => {
 *    // fetch product from upstream API (you'll need to write this function)
 *    return fetchProduct(id).then(result => {
 *      return result.product // this will be the result of router.run()
 *    })
 *  })
 *
 *  // assuming env.path = /products/1 and env.method = 'GET'
 *  router.run() // => the details for product 1
 *
 * Routes can be divided into multiple files to increase maintainability using the "use()" method.  For example:
 *
 *  // /scripts/api/router.js
 *
 *  const appShell = require('/build/index.html.js)
 *
 *  module.exports = new Router()
 *    .fallback(() => appShell) // render the PWA's app shell for all unmatched routes
 *    .use('/products', require('/api/products.js'))
 *
 *
 *  // /scripts/api/products.js
 *
 *  module.exports = new Router()
 *    .get('/:id', ({ id }) => new Promise((resolve, reject) => {
 *      // fetch product from upstream API...
 *     }))
 *
 *
 *  // /scripts/index.js
 *
 *  const router = require('/api/router')
 *
 *  module.exports = function() {
 *    // ...
 *    router.run().then((result) => {
 *      const body = typeof result === 'string' ? result : JSON.stringify(result)
 *      sendResponse({ body, htmlparsed: true })
 *    })
 *  }
 *
 * Router is an EventEmitting that fires the following events:
 *
 * `before`: Fires before a route is run, passing an object containing `request` and `response`.
 * `after`: Fires after a route is run and all handlers have finised, passing an object containing `request` and `response`.
 * `fetch`: Fires when a `fromServer` handler runs on the client, resulting in a fetch from the server. No arguments are passed to the event handler.
 */
export default class Router extends EventEmitter {
  routes = []

  appShellConfigured = false

  isBrowser = process.env.MOOV_RUNTIME === 'client'

  fallbackHandlers = [
    {
      runOn: { client: true, server: true },
      fn: () => ({ page: '404' })
    }
  ]

  constructor() {
    super()
    this.get('/.powerlinks.js', fromServer(powerLinkHandler))
  }

  errorHandler = (e, params, request, response) => {
    if (response && response.status) {
      response.status(500, 'error')
    }
    return { page: 'Error', error: e.message, stack: e.stack, loading: false }
  }

  pushRoute(method, path, handlers) {
    // We are explicitly setting a JSON route in order to handle
    // model data routes
    this.routes.push({ path: new Route(path + '.json'), method, handlers })
    this.routes.push({ path: new Route(path + '.amp'), method, handlers })
    this.routes.push({ path: new Route(path), method, handlers })
    return this
  }

  /**
   * Registers a GET route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  get(path, ...handlers) {
    return this.pushRoute('GET', path, handlers)
  }

  /**
   * Registers a POST route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  post(path, ...handlers) {
    return this.pushRoute('POST', path, handlers)
  }

  /**
   * Registers a PATCH route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  patch(path, ...handlers) {
    return this.pushRoute('PATCH', path, handlers)
  }

  /**
   * Registers a PUT route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  put(path, ...handlers) {
    return this.pushRoute('PUT', path, handlers)
  }

  /**
   * Registers a DELETE route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  delete(path, ...handlers) {
    return this.pushRoute('DELETE', path, handlers)
  }

  /**
   * Registers an OPTIONS route
   * @param {String} path A path pattern
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  options(path, ...handlers) {
    return this.pushRoute('OPTIONS', path, handlers)
  }

  /**
   * Designates the handlers for unmatched routes
   * @param {Function} callback A function that returns a promise that resolves to the content to return
   * @return {Router} this
   */
  fallback(...handlers) {
    this.fallbackHandlers = handlers
    return this
  }

  /**
   * Defines the handler for the app-shell.  Generally this should be a single fromServer handler that return
   * the global data for menus and navigation and sets loading: true.  The app-shell is used in offline mode
   * during initial landing on an uncached SSR result.
   * @param {...any} handlers Handlers that return patches to be merged into the app state
   * @return {Router} this
   */
  appShell(...handlers) {
    this.appShellConfigured = true
    return this.get('/.app-shell', ...handlers)
  }

  /**
   * Returns `true` if `appShell` has been called to configure an appShell route, otherwise `false`.
   * @return {Boolean}
   */
  isAppShellConfigured() {
    return this.appShellConfigured
  }

  /**
   * Sets the handler for errors thrown during route handling
   * @param {Function} handler A function that returns a promise that resolves to the content to return
   * @return {Router} this
   */
  error(handler) {
    this.errorHandler = handler
    return this
  }

  /**
   * Registers a set of nested routes.
   *
   * Example:
   *
   *  Router root = new Router()
   *
   *  Router products = new Router()
   *  products.get('/:id', ({ id }) => {
   *    return Promise.resolve(id)
   *  })
   *
   *  root.use('/products', products)
   *
   *  // url: /products/1
   *  root.run().then(result => console.log(result)) // => 1
   *
   * @param {String} path The parent path
   * @param {Router} router A router to handle the nested routes
   * @return {Router} this
   */
  use(path, router) {
    for (let route of router.routes) {
      const { path: routePath, ...rest } = route
      this.routes.push({ path: new Route(path + routePath.spec), ...rest })
    }
    return this
  }

  /**
   * Configures service worker runtime caching options
   * @param {Object} options
   * @param {Object} options.cacheName The name of the runtime cache
   * @param {Object} options.maxEntries The max number of entries to store in the cache
   * @param {Object} options.maxAgeSeconds The TTL in seconds for entries
   * @return {Router} this
   */
  configureClientCache(options) {
    configureCache(options)
    return this
  }

  /**
   * Gets the server cache key for the matching route.
   * @param {Object} request
   * @param {Object} defaults The default values used for the cache key
   * @return {Object} An object populate with keys and values that when hashed, make up the cache key
   */
  getCacheKey(request, defaults) {
    const { match } = this.findMatchingRoute(request)
    const handlers = match ? match.handlers : this.fallbackHandlers
    if (!handlers) return defaults
    const cacheHandler = handlers.find(handler => handler.type === 'cache')
    if (!cacheHandler || !cacheHandler.server || !cacheHandler.server.key) return defaults
    return cacheHandler.server.key(request, defaults)
  }

  /**
   * Creates an object describing the browser location
   * @return {Object}
   */
  createLocation() {
    return {
      protocol: location.protocol.replace(/:/, ''),
      pathname: location.pathname,
      search: location.search,
      hostname: location.hostname,
      port: location.port
    }
  }

  /**
   * Runs the current url (from env) and generates a result from each the matching route's handlers.
   * @param {Object} request The request being served
   * @param {String} request.path The url path
   * @param {String} request.method The http method
   * @param {Response} response The response object
   * @param {Object} options
   * @param {Boolean} [options.initialLoad=false] Set to true if this is the initial load of the application.  This will cause the HTML to be cached for the current path
   * @return {Object} Generates state objects
   */
  async *run(request, response, { initialLoad = false, historyState = {} } = {}) {
    const { match, params } = this.findMatchingRoute(request)

    request.params = params

    const handlers = match ? match.handlers : this.fallbackHandlers
    const willFetchFromServer = !initialLoad && handlers.some(h => h.type === 'fromServer')

    // Here we ensure that the loading mask is displayed immediately if we are going to fetch from the server
    // and that the app state's location information is updated.

    if (request.path.endsWith('.json')) {
      yield {
        format: 'json'
      }
    }

    if (this.isBrowser) {
      yield {
        loading: willFetchFromServer,
        location: this.createLocation(),
        ...historyState
      }
    }

    try {
      for (let handler of handlers) {
        if (typeof handler === 'function') {
          handler = {
            runOn: { server: true, client: true },
            fn: handler
          }
        }

        // skip state handlers on initial hydration - we just need to run cache and track
        if (initialLoad && handler.type !== 'cache') {
          continue
        }

        // skip server handlers when running in the browser
        if (!handler.runOn.client && this.isBrowser) {
          continue
        }

        // skip client handlers when running on server
        if (!handler.runOn.server && !this.isBrowser) {
          continue
        }

        // skip client handlers when serving an AJAX request on the server
        if (request.path.endsWith('.json') && (handler.runOn.server !== true || this.isBrowser)) {
          continue
        }

        if (handler.type === 'fromServer') {
          this.emit('fetch')
        }

        const result = await this.toPromise(handler.fn, params, request, response)

        if (result) {
          yield result
        }
      }
    } catch (err) {
      // We emit an error event here so that we can pass the error to the error reporter
      // while still allowing the user to provide their own error handler function.
      this.emit('error', err)

      // call the .error() function registered by the user
      yield this.errorHandler(err, params, request, response)
    }
  }

  /**
   * Runs all client and server handlers for the specified path and method
   * @param {Object} request The request being served
   * @param {String} request.path The url path
   * @param {String} request.method The http method
   * @param {Response} response The response object
   * @param {Object} options
   * @param {Object} [state={}] The accumulated state from other handlers
   * @return {Object} The merged result of all handlers
   */
  async runAll(request, response, options, state = {}) {
    state = cloneDeep(state) // prevent initial state from being mutated

    for await (let result of this.run(request, response, options)) {
      if (typeof result === 'string') {
        state = result
      } else {
        merge(state, result)
      }
    }

    return state
  }

  /**
   * Converts specified callback to a promise
   * @param {Function/Object} callback A function that returns a Promise that
   *  resolves to the new state, a function that returns the new state, or the new state itself.
   * @param {Object} params The request parameters
   * @param {Object} request The request object with body and headers
   * @param {Response} response The response object
   */
  toPromise(callback, params, request, response) {
    if (isFunction(callback)) {
      const result = callback(params, request, response)

      if (result && result.then) {
        // callback returned a promise
        return result
      } else {
        // callback returned the new state
        return Promise.resolve(result)
      }
    } else {
      // callback is the new state
      return Promise.resolve(callback)
    }
  }

  /**
   * Returns the matching route and parsed params for the specified path and method
   * @param {Object} request The http request
   * @return {Object} an object with match and params
   */
  findMatchingRoute(request) {
    let params
    let { path, query, method = 'GET' } = request

    method = method.toUpperCase()

    const match = this.routes
      .filter(route => method === route.method)
      .find(route => (params = route.path.match(path)))

    return { match, params: { ...params, ...query } }
  }

  /**
   * Returns true if the URL points to a route that has a proxyUpstream handler.
   * @param {String} url The url to check
   * @param {String} [method='get']
   * @return {Boolean}
   */
  willNavigateToUpstream(url, method = 'get') {
    const { pathname: path, search } = new URL(
      url,
      typeof window !== 'undefined' ? window.location : undefined
    )
    return this.willFetchFromUpstream({ path, search, method })
  }

  /**
   * Returns true if the route will result in the server connecting to the
   * upstream site due to the presence of a `proxyUpstream` handler, otherwise
   * false.
   * @private
   * @param {Object} request
   * @return {Boolean}
   */
  willFetchFromUpstream(request) {
    const { match } = this.findMatchingRoute(request)
    let handlers = match ? match.handlers : this.fallbackHandlers
    return handlers.some(handler => handler.type === 'proxyUpstream')
  }

  /**
   * Runs all client and server handlers for the specified location and returns state
   */
  fetchFreshState = location => {
    const { pathname, search } = location
    const request = { path: pathname, search, query: qs.parse(search), method: 'GET' }
    const response = new ClientContext()
    const options = { initialLoad: false }
    return this.runAll(request, response, options, location.state)
  }

  /**
   * Called when the location is changed on the client
   * @param {Function} callback A callback to pass the new state to
   * @param {Object} location The new location
   */
  onLocationChange = async (callback, location, action) => {
    if (action === 'REPLACE') return

    // no need to run the route if the location hasn't changed
    if (
      location.pathname === this.prevLocation.pathname &&
      location.search === this.prevLocation.search
    ) {
      return
    }

    this.prevLocation = location // this needs to come before handlers are called or going back while async handlers are running will lead to a broken state

    const { pathname, search } = location
    const request = { path: pathname, search, query: qs.parse(search), method: 'GET' }
    const context = new ClientContext()
    const { state } = location

    if (state) {
      callback(state, action) // called when restoring history state and applying state from Link components
    }

    this.emit('before', { request, response: context })

    if (action === 'PUSH' || !state) {
      /*
       * Why limit action to PUSH here? POP indicates that the user is going back or forward
       * In those cases, if we have location.state, we can assume it's the full state.  We don't need to
       * do anything for replace.
       */
      for await (let state of this.run(request, context, { historyState: state })) {
        callback(state, action)
      }
    } else if (state) {
      callback(state, action) // called when restoring history state and applying state from Link components
    }

    this.emit('after', { request, response: context })
  }

  /**
   * Calls the specified callback whenever the current URL changes
   * @param {History} history
   * @param {Function} callback
   * @return {Router} this
   */
  watch(history, callback) {
    this.history = history
    this.prevLocation = history.location

    history.listen(this.onLocationChange.bind(this, callback))

    const { pathname, search } = history.location
    const request = { path: pathname, search, query: qs.parse(search), method: 'GET' }
    const context = new ClientContext(request)

    this.runAll(request, context, { initialLoad: true }, window.initialState)
    this.emit('after', { request, response: context, initialLoad: true })

    return this
  }

  /**
   * Provides an easy way to navigate by changing some but not all of the query params.  Any keys
   * included in the params object are applied as new query param values.  All other query params are preserved.
   * @param {Object} params Key/value pairs to apply to the query string.  Specifying a value of undefined or null will remove that parameter from the query string
   * @param {Object} [stringifyOptions={}] Options of stringifying all query params.  Applied for `qs.stringify`: https://github.com/ljharb/qs#stringifying
   */
  applySearch(params, stringifyOptions = {}) {
    const { history } = this

    const nextParams = qs.stringify(
      {
        ...qs.parse(history.location.search, { ignoreQueryPrefix: true }),
        ...params
      },
      stringifyOptions
    )

    history.replace(`${history.location.pathname}?${nextParams}`)
  }
}
