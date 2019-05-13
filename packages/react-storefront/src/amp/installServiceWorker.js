/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import registerServiceWorker from '../registerServiceWorker'
import { prefetch, waitForServiceWorkerController } from '../router/serviceWorker'
import qs from 'qs'

waitForServiceWorkerController().then(() => {
  if (window.location.search.length) {
    const { preload } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    if (preload) {
      try {
        JSON.parse(preload).forEach(url => prefetch(url))
      } catch (e) {
        console.error(`could not parse preload list from query string: ${preload}`, e)
      }
    }
  }
})

registerServiceWorker()
