/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { inject, observer, Provider } from 'mobx-react'
import { Helmet } from 'react-helmet'
import withStyles from '@material-ui/core/styles/withStyles'
import CssBaseline from '@material-ui/core/CssBaseline'
import { canUseClientSideNavigation } from './utils/url'
import delegate from 'delegate'
import { cache } from './router/serviceWorker'
import { isSafari } from './utils/browser'
import { connectReduxDevtools } from 'mst-middlewares'
import { onSnapshot } from 'mobx-state-tree'
import debounce from 'lodash/debounce'

/**
 * @private
 * Internal PWA root used when launching the app.  Do not use this class directly
 */
export const styles = theme => ({
  '@global': {
    'body.moov-modal': {
      overflow: 'hidden',
      position: 'fixed',
      maxWidth: '100vw',
      maxHeight: '100vh',
    },
    'body.moov-blur #root': {
      filter: 'blur(5px)',
      transition: `filter ${theme.transitions.duration.enteringScreen}ms`,
    },
  },
})

@withStyles(styles)
@inject(({ app, history, router }) => ({ menu: app.menu, app, history, router, amp: app.amp }))
@observer
export default class PWA extends Component {
  _nextId = 0

  render() {
    const { amp, app } = this.props

    return (
      <Provider nextId={this.nextId}>
        <Fragment>
          <CssBaseline />
          <Helmet>
            <html lang="en" />
            <meta charset="utf-8" />
            <meta
              name="viewport"
              content="width=device-width,initial-scale=1,minimum-scale=1,shrink-to-fit=no"
            />
            <meta name="theme-color" content="#000000" />
            {app.description ? <meta name="description" content={app.description} /> : null}
            {app.canonicalURL ? <link rel="canonical" href={app.canonicalURL} /> : null}
            <link rel="manifest" href="/manifest.json" />
            <title>{app.title}</title>
          </Helmet>
          {amp && (
            <Helmet>
              <script async src="https://cdn.ampproject.org/v0.js" />
              <script
                async
                custom-element="amp-install-serviceworker"
                src="https://cdn.ampproject.org/v0/amp-install-serviceworker-0.1.js"
              />
            </Helmet>
          )}
          {amp && (
            <amp-install-serviceworker
              src={`${app.location.urlBase}/service-worker.js`}
              data-iframe-src={`${app.location.urlBase}/pwa/install-service-worker.html`}
              layout="nodisplay"
            />
          )}
          {this.props.children}
        </Fragment>
      </Provider>
    )
  }

  nextId = () => {
    return this._nextId++
  }

  componentDidCatch(error, info) {
    const { app } = this.props

    app.applyState({
      page: 'Error',
      error: error.message,
      stack: info.componentStack,
    })
  }

  componentDidMount() {
    const { router, app, history } = this.props

    if (router) {
      router.on('fetch', this.resetPage)
      router.watch(history, app.applyState)
    }

    this.bindAppStateToHistory()

    // scroll to the top and close the when the router runs a PWA route
    this.watchLinkClicks()

    // put os class on body for platform-specific styling
    this.addDeviceClassesToBody()

    // set initial offline status
    app.setOffline(!navigator.onLine)

    window.addEventListener('online', () => {
      app.setOffline(false)
      // Fetch fresh page data since offline version may not be correct
      if (router) {
        router.fetchFreshState(document.location).then(app.applyState)
      }
    })

    window.addEventListener('offline', () => {
      app.setOffline(true)
    })

    // Fetching new app state for offline page
    if (!navigator.onLine && app.page === null) {
      router.fetchFreshState(document.location).then(app.applyState)
    }

    // only cache app shell and page if online
    if (navigator.onLine) {
      // cache the launch screen for when the pwa is installed on the desktop
      cache('/?source=pwa')
      // cache the initial page HTML and json
      const path = app.location.pathname + app.location.search
      cache(path + '.json', app.toJSON())
      cache(path, `<!DOCTYPE html>\n${document.documentElement.outerHTML}`)
    }

    this.handleRejections()

    if (process.env.NODE_ENV !== 'production' && process.env.NODE_ENV !== 'test') {
      connectReduxDevtools(require('remotedev'), app)
    }
  }

  /**
   * Each time the app state changes, record the current app state as the history.state.
   * This makes restoring the page when going back really fast.
   */
  bindAppStateToHistory() {
    const { app, history } = this.props

    const recordState = snapshot => {
      const { pathname, search } = history.location
      history.replace(pathname + search, snapshot)
    }

    // record app state in history.state restore it when going back or forward
    // see Router#onLocationChange
    onSnapshot(app, debounce(snapshot => !snapshot.loading && recordState(snapshot), 150))

    // record the initial state so that if the user comes back to the initial landing page the app state will be restored correctly.
    recordState(app.toJSON())
  }

  /**
   * When an unhandled rejection occurs, store the error in app state so it
   * can be displayed to the developer.
   */
  handleRejections() {
    window.addEventListener('unhandledrejection', event => this.props.app.onError(event.reason))
  }

  /**
   * Adds a css class corresponding to the browser to the body element
   * @private
   */
  addDeviceClassesToBody() {
    if (isSafari()) {
      document.body.classList.add('moov-safari')
    }
  }

  /**
   * Returns true if client-side navigation should be forced, otherwise false
   * @param {HTMLElement} linkEl
   * @return {Boolean}
   */
  shouldNavigateOnClient(linkEl) {
    const href = linkEl.getAttribute('href')
    const linkTarget = linkEl.getAttribute('target')

    // false if the element is not a link
    if (linkEl.tagName.toLowerCase() !== 'a') return false

    // false if the link was rendered by react-storefront/Link - it will handle nav on its own
    if (linkEl.getAttribute('data-moov-link') === 'on') return false

    // false if link has data-reload="on|true"
    if (['true', 'on'].indexOf(linkEl.getAttribute('data-reload')) !== -1) return false

    // false for links with a target other than self
    if (linkTarget && linkTarget !== '_self') return false

    return canUseClientSideNavigation(href, this.props.router)
  }

  /**
   * Watches for clicks on all links and forces client-side navigation if the domain is the same.
   * This behavior can be overridden by adding data-reload="on" to any link
   */
  watchLinkClicks() {
    // capture click events
    delegate('a', 'click', e => {
      const { delegateTarget } = e

      if (this.shouldNavigateOnClient(delegateTarget)) {
        // don't reload the page
        e.preventDefault()

        // instead do the navigation client-side using the history API
        this.props.history.push(delegateTarget.getAttribute('href'))
      }
    })
  }

  resetPage = () => {
    window.scrollTo(0, 0)
    this.props.menu.close()
  }
}
