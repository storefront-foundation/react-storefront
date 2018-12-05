/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import 'babel-polyfill'
import 'proxy-polyfill' // needed for IE9-11
import React from 'react'
import { hydrate } from './renderers'
import { connectReduxDevtools } from "mst-middlewares"
import createBrowserHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker'
import PWA from './PWA'
import { onSnapshot } from 'mobx-state-tree'
import debounce from 'lodash/debounce'

/**
 * Bootstraps the PWA react application.
 * @param {options} options
 * @param {React.Element} options.app The root app element
 * @param {Object} options.theme A material-ui theme
 * @param {Object} options.model A mobx-state-tree model class
 * @param {HTMLElement} options.target The DOM element to mount onto
 */
export default function launchClient({ App, theme, model, router, target = document.getElementById('root') }) {
  const history = createBrowserHistory()

  const state = hydrate({
    component: <PWA><App/></PWA>,
    model, 
    theme,
    target,
    providerProps: {
      history, 
      router
    }
  })

  if (process.env.NODE_ENV !== 'production') {
    connectReduxDevtools(require("remotedev"), state)
    window.addEventListener('unhandledrejection', event => window.moov.state.onError(event.reason))
  }

  // record app state in history.state restore it when going back or forward
  // see Router#onLocationChange
  onSnapshot(state, debounce(snapshot => {
    const { pathname, search } = history.location

    if (!snapshot.loading) {
      history.replace(pathname + search, snapshot)
    }
  }, 150))

  window.addEventListener('load', () => {
    // we only start watching after the window.onload event so that
    // timing metrics are fully collected and be reported correctly to analytics
    router.watch(history, state.applyState)
  })
  
  registerServiceWorker()
}