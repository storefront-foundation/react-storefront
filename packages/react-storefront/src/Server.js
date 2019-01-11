/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { configure } from 'mobx'

configure({ isolateGlobalState: true })

import React from 'react'
import { SheetsRegistry } from 'react-jss/lib/jss'
import { flushChunkNames } from 'react-universal-component/server'
import PWA from './PWA'
import createMemoryHistory from 'history/createMemoryHistory'
import { Helmet } from "react-helmet"
import sanitizeAmpHtml from './amp/sanitizeAmpHtml'
import { renderHtml, renderInitialStateScript, renderScript, renderStyle } from './renderers'
import Response from './router/Response'
import { renderAmpAnalyticsTags } from './Track'
import createRequest from './platform/createRequest'
import getStats from 'react-storefront-stats'

export default class Server {

  /**
   * @param {Object} config
   * @param {Object} config.theme A material-UI theme
   * @param {Class} config.model The model class for the root of the state tree
   * @param {React.Component} config.App The root app component
   * @param {Router} config.router An instance of moov_router's Router class
   * @param {Boolean} [config.deferScripts=true] Adds the defer attribute to all script tags to speed up initial page render. Defaults to true.
   */
  constructor({ theme, model, App, router, deferScripts=true }) {
    console.error = console.warn = console.log

    Object.assign(this, {
      theme, 
      model, 
      App, 
      router,
      deferScripts
    })
  }

  /**
   * Handles an isomorphic request by serving json, html, or amp content based on the URL.
   */
  serve = async () => {
    console.error = console.error || console.log
    console.warn = console.warn || console.log

    const request = createRequest()
    const response = new Response(request)
  
    try {
      // indicate to the XDN that we want to to add set the x-moov-cache-hit cookie so we can differentiate
      // cache hits and misses when tracking performance
      response.set('x-rsf-track-cache-hit', 'true')

      const state = await this.router.runAll(request, response)

      if (!state.proxyUpstream && !response.sent) {
        await this.renderPWA({ request, response, state })
      }
    } catch (e) {
      await this.renderError(e, request, response)
    }
  }

  /**
   * Sets the content type to application/json for json URLs, text/html for all others
   * @param {Object} request 
   * @param {Response} response 
   */
  setContentType(request, response) {
    if (response.get('content-type') == null) {
      if (request.pathname.endsWith('.json')) {
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
   * @param {Object} options.state The root react element
   * @return The html for app
   */
  async renderPWA({ request, response, state }) {
    console.error = console.error || console.log
    console.warn = console.warn || console.log

    const { protocol, hostname, port, pathname, search } = request
    this.setContentType(request, response)

    if (pathname.endsWith('.json')) {
      return response.send(JSON.stringify(state))
    }

    const amp = pathname.endsWith('.amp')
    const { App, theme }  = this
    const sheetsRegistry = new SheetsRegistry()
    const history = createMemoryHistory({ initialEntries: [pathname + search] })

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

    try {
      const stats = await getStats()

      let html = renderHtml({
        component: <PWA><App/></PWA>,
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

      html = `
        <!DOCTYPE html>
        <html${amp ? ' ⚡' : ''} ${helmet.htmlAttributes.toString()}>
          <head>
            ${helmet.title.toString()}
            ${ amp ? `
              <style amp-boilerplate>body{-webkit-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-moz-animation:-amp-start 8s steps(1,end) 0s 1 normal both;-ms-animation:-amp-start 8s steps(1,end) 0s 1 normal both;animation:-amp-start 8s steps(1,end) 0s 1 normal both}@-webkit-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-moz-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-ms-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@-o-keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}@keyframes -amp-start{from{visibility:hidden}to{visibility:visible}}</style><noscript><style amp-boilerplate>body{-webkit-animation:none;-moz-animation:none;-ms-animation:none;animation:none}</style></noscript>
              <style amp-custom id="ssr-css">
                ${sheetsRegistry.toString().replace(/\!important/g, '')}
                ${helmet.style.toString().replace(/<\/?style[^>]*>/g, '')}
              </style>
            ` : `
              <noscript id="jss-insertion-point"></noscript>
            `}
            ${helmet.meta.toString()}
            ${helmet.link.toString()}
            ${helmet.script.toString()}
            ${ amp ? `<script async custom-element="amp-analytics" src="https://cdn.ampproject.org/v0/amp-analytics-0.1.js"></script>` : ''}
          </head>
          <body${amp ? ' class="moov-amp"': ''} ${helmet.bodyAttributes.toString()}>
            ${ amp ? renderAmpAnalyticsTags() : '' }
            ${ amp ? '' : renderStyle({ registry: sheetsRegistry }) }
            <noscript>
              You need to enable JavaScript to run this app.
            </noscript>
            <div id="root">${html}</div>
            ${ amp ? '' : `
              ${renderInitialStateScript({ state: model, defer: this.deferScripts })}
              ${renderScript({ stats, chunk: 'bootstrap', defer: this.deferScripts })}
              ${this.getScripts(stats)}
              ${renderScript({ stats, chunk: 'main', defer: this.deferScripts })}
            `}
          </body>
        </html>
      `

      if (amp) {
        html = sanitizeAmpHtml(html)
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
   * @param {Response} response 
   */
  renderError(e, request, response) {
    response.status(500, 'error')

    return this.renderPWA({ 
      request, 
      response, 
      state: { 
        page: 'Error', 
        error: e.message, 
        stack: process.env.MOOV_ENV === 'production' ? null : e.stack 
      }
    })
  }

  /**
   * Gets the script tags that should added to the document based on the chunks used
   * to render the current request.
   * @param {Object} stats 
   * @return {String[]}
   */
  getScripts(stats) {    
    return flushChunkNames()
      .map(chunk => renderScript({ stats, chunk, defer: this.deferScripts }))
      .filter(e => !!e)
  }
}

