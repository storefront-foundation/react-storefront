/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { createBrowserHistory } from 'history'
import hydrate from './utils/hydrate'
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
 * @param {Boolean} options.delayHydrationUntilPageLoad If `true` hydration will not occur until the window load event.  This helps improve initial page load time, especially largest image render.
 */
export default function launchClient({
  App,
  theme,
  model,
  router,
  target = document.getElementById('root'),
  errorReporter = Function.prototype,
  serviceWorker = true,
  delayHydrationUntilPageLoad = false
}) {
  scheduleHydration(delayHydrationUntilPageLoad, () => {
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
  })

  if (serviceWorker) {
    registerServiceWorker()
  } else {
    unregister()
  }
}

/**
 * Schedules hydration based on the specified options
 * @param {Boolean} options.delayHydrationUntilPageLoad If `true` hydration will not occur until the window load event.  This helps improve initial page load time, especially largest image render.
 * @param {Function} delayHydrationUntilPageLoad A function that hydrates the react app
 */
function scheduleHydration(delayHydrationUntilPageLoad, hydrate) {
  if (delayHydrationUntilPageLoad && document.readyState !== 'complete') {
    return window.addEventListener('load', hydrate, { once: true })
  } else {
    hydrate()
  }
}
