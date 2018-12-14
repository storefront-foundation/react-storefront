/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import registerServiceWorker from '../registerServiceWorker'
import { prefetch, waitForServiceWorkerController } from '../router/serviceWorker'
import qs from 'qs'

registerServiceWorker()

waitForServiceWorkerController().then(() => {
  if (window.location.search.length) {
    const { preload } = qs.parse(window.location.search, { ignoreQueryPrefix: true })

    console.log('preload', preload)
  
    if (preload) {
      console.log(JSON.parse(preload))
      JSON.parse(preload).forEach(url => prefetch(url))
    }
  }
})

