/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { hydrate } from './renderers'
import createBrowserHistory from 'history/createBrowserHistory'
import registerServiceWorker from './registerServiceWorker'
import PWA from './PWA'

/**
 * Bootstraps the PWA react application.
 * @param {options} options
 * @param {React.Element} options.App The root app element
 * @param {Object} options.theme A material-ui theme
 * @param {Object} options.model A mobx-state-tree model class
 * @param {HTMLElement} options.target The DOM element to mount onto
 */
export default function launchClient({
  App,
  theme,
  model,
  router,
  target = document.getElementById('root')
}) {
  const history = createBrowserHistory()

  hydrate({
    component: (
      <PWA>
        <App />
      </PWA>
    ),
    model,
    theme,
    target,
    providerProps: {
      history,
      router
    }
  })

  registerServiceWorker()
}
