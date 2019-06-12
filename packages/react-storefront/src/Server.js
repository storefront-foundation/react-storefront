/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import React from 'react'
import { SheetsRegistry } from 'react-jss/lib/jss'
import { flushChunkNames } from 'react-universal-component/server'
import PWA from './PWA'
import createMemoryHistory from 'history/createMemoryHistory'
import { Helmet } from 'react-helmet'
import {
  renderHtml,
  renderInitialStateScript,
  renderScript,
  renderStyle,
  renderPrefetchHeader,
  getScripts
} from './renderers'
import getStats from 'react-storefront-stats'
import { renderAmpAnalyticsTags } from './Track'
import { ROUTES } from './router/headers'
import flatten from 'lodash/flatten'

export default class Server {
  /**
   * @param {Object} config
   * @param {Object} config.theme A material-UI theme
   * @param {Class} config.model The model class for the root of the state tree
   * @param {React.Component} config.App The root app component
   * @param {Router} config.router An instance of moov_router's Router class
   * @param {Boolean} [config.deferScripts=true] Adds the defer attribute to all script tags to speed up initial page render. Defaults to true.
   * @param {Function} transform A function to transform the rendered HTML before it is sent to the browser
   * @param {Function} errorReporter A function to call when an error occurs so that it can be logged
   */
  constructor({
    theme,
    model,
    App,
    router,
    deferScripts = true,
    transform,
    errorReporter = Function.prototype
  }) {
    console.error = console.warn = console.log

    Object.assign(this, {
      theme,
      model,
      App,
      router,
      deferScripts,
      transform,
      errorReporter
    })
  }

  /**
   * Handles an isomorphic request by serving json, html, or amp content based on the URL.
   */
  serve = async (request, response) => {
    console.error = console.error || console.log
    console.warn = console.warn || console.log

    const history = createMemoryHistory({ initialEntries: [request.path + request.search] })

    if (request.headers[ROUTES]) {
      return response.json(this.router.routes.map(route => route.path.spec))
    }

    let state

    const reportError = error => {
      this.errorReporter({ error, history, app: state })
    }

    try {
      this.router.on('error', reportError)
      state = await this.router.runAll(request, response)

      if (!state.proxyUpstream && !response.headersSent) {
        await this.renderPWA({ request, response, state, history })
      }
    } catch (e) {
      reportError(e)
      await this.renderError(e, request, response, history)
    } finally {
      this.router.off('error', this.errorReporter)
    }
  }

  /**
   * Sets the content type to application/json for json URLs, text/html for all others
   * @param {Object} request
   * @param {Response} response
   */
  setContentType(request, response) {
    if (response.get('content-type') == null) {
      if (request.path.endsWith('.json')) {
        response.set('content-type', 'application/json')
      } else {
        response.set('content-type', 'text/html')
      }
    }
  }

  /**
   * Renders either a JSON or HTML response for the given state based on the path suffix.
   * @param {Object} options
   * @param {Object} options.request The current request object
   * @param {Response} options.response The current response object
   * @param {Object} options.state The app state
   * @param {Object} options.history The js history object
   * @return The html for app
   */
  async renderPWA({ request, response, state, history }) {
    console.error = console.error || console.log
    console.warn = console.warn || console.log

    const { App, theme } = this
    const { protocol, hostname, port, path } = request
    this.setContentType(request, response)

    if (path.endsWith('.json')) {
      return response.send(JSON.stringify(state))
    }

    const amp = path.endsWith('.amp')
    const sheetsRegistry = new SheetsRegistry()

    const model = this.model.create({
      ...state,
      amp,
      initialWidth: amp ? 'xs' : state.initialWidth,
      location: {
        ...history.location,
        port,
        protocol,
        hostname
      }
    })

    this.chunkNames = []

    try {
      const stats = await getStats()

      let html = renderHtml({
        component: (
          <PWA>
            <App />
          </PWA>
        ),
        providers: {
          app: model,
          history,
          analytics: {},
          router: this.router
        },
        registry: sheetsRegistry,
        theme
      })

      const helmet = Helmet.renderStatic()

      const chunks = flushChunkNames(stats)

      const scripts = flatten([
        getScripts({ stats, chunk: 'bootstrap' }),
        getScripts({ stats, chunk: 'main' }),
        chunks.map(chunk => getScripts({ stats, chunk }))
      ])

      // Set prefetch headers so that our scripts will be fetched
      // and loaded as fast as possible
      const prefetchHeaders = scripts.map(renderPrefetchHeader).join(',')
      response.set('link', prefetchHeaders)

      html = `
        <!DOCTYPE html>
        <html ${helmet.htmlAttributes.toString()}>
          <head>
            ${helmet.title.toString()}
            <noscript id="jss-insertion-point"></noscript>
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${helmet.script.toString()}
          </head>
          <body ${helmet.bodyAttributes.toString()}>
            ${renderStyle({ registry: sheetsRegistry, id: 'ssr-css' })}
            <noscript>
              You need to enable JavaScript to run this app.
            </noscript>
            <div id="root">${html}</div>
            ${
              amp
                ? ''
                : `
              ${renderInitialStateScript({
                state: model,
                routeData: state,
                defer: this.deferScripts
              })}
              ${scripts.map(src => renderScript(src, this.deferScripts)).join('')}
            `
            }
          </body>
        </html>
      `

      if (typeof this.transform === 'function') {
        html = await this.transform(html, { model, sheetsRegistry, helmet })
      }

      response.send(html)
    } catch (e) {
      // flush head content to prevent memory leak, see https://github.com/nfl/react-helmet#server-usage
      Helmet.renderStatic()

      // flush amp analytics tags to prevent memory leak
      renderAmpAnalyticsTags()

      throw e
    }
  }

  /**
   * Renders an error response, either as JSON or SSR HTML, depending on the suffix
   * on the request path.
   * @param {Error} e
   * @param {Request} request
   * @param {Response} response
   */
  renderError(e, request, response, history) {
    response.status(500, 'error')

    const state = {
      page: 'Error',
      error: e.message,
      stack: process.env.MOOV_ENV === 'production' ? null : e.stack
    }

    if (request.path.endsWith('.json')) {
      response.send(state)
    }

    this.renderPWA({
      request,
      response,
      state,
      history
    })
  }
}
