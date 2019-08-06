/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { hydrate } from './renderers'
import { createBrowserHistory } from 'history'
import registerServiceWorker, { unregister } from './registerServiceWorker'
import PWA from './PWA'

/**
 * Bootstraps the PWA react application.
 * @param {options} options
 * @param {React.Element} options.App The root app element
 * @param {Object} options.theme A material-ui theme
 * @param {Class} options.model A mobx-state-tree model class, typically extending `react-storefront/model/AppModelBase`
 * @param {HTMLElement} options.target The DOM element to mount onto
 * @param {Function} options.errorReporter A function to call when an error occurs so that it can be logged, typically located in `src/errorReporter.js`.
 * @param {Boolean} options.serviceWorker A flag for controlling if a service worker is registered
 */
export default function launchClient({
  App,
  theme,
  model,
  router,
  target = document.getElementById('root'),
  errorReporter = Function.prototype,
  serviceWorker = true
}) {
  const history = createBrowserHistory()

  hydrate({
    component: (
      <PWA errorReporter={errorReporter}>
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

  if (serviceWorker) {
    registerServiceWorker()
  } else {
    unregister()
  }
}
