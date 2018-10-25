/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

let _targets = []

/**
 * Configures the PWA to broadcast events to all specified targets.  Once configured, You can all any method on
 * the the default import from this module it will attempt to call a method of the same name on each target.  
 * 
 * Example:
 * 
 *  // src/analytics.js
 * 
 *  import { configureAnalytics } from 'react-storefront/analytics'
 *  import GoogleTagManagerTarget from 'moov-pwa-analytics/GoogleTagManagerTarget'
 *  import MerkleSearchTarget from 'moov-pwa-analytics/MerkleSearchTarget'
 * 
 *  configureAnalytics(
 *    new GoogleTagManagerTarget({ apiKey: 'my_gtm_api_key' }),
 *    new MerkleSearchTarget({ apiKey: 'my_merkle_api_key' })
 *  )
 * 
 * // then, to broadcast an analytics event to all targets:
 * 
 * import analytics from 'react-storefront/analytics'
 * 
 * analytics.someEvent() // this will call the 'someEvent' method on all configured targets
 * 
 * @param {AnalyticsTarget[]} targets An array of targets to notify when analytics events occur
 * @return {AnalyticsProvider}
 */
export function configureAnalytics(...targets) {
  _targets = targets
}

export function getTargets() {
  return _targets
}

/**
 * This module's default export is a single entry point for broadcasting analytics events to all targets configured via `configureAnalytics`.
 * Each target represents a tag manager or other analytics service to which the application should send data.
 * 
 * Example:
 * 
 *  // src/analytics.js
 * 
 *  import { configureAnalytics } from 'react-storefront/analytics'
 *  import GoogleTagManagerTarget from 'moov-pwa-analytics/GoogleTagManagerTarget'
 *  import MerkleSearchTarget from 'moov-pwa-analytics/MerkleSearchTarget'
 * 
 *  configureAnalytics(
 *    new GoogleTagManagerTarget({ apiKey: 'my_gtm_api_key' }),
 *    new MerkleSearchTarget({ apiKey: 'my_merkle_api_key' })
 *  )
 * 
 */
export default new Proxy(
  { 
    setHistory: () => {} // polyfill for IE11 requires defined fields in Target argument
  }, 
  {
    get: function (o, method) {
      return function(...args) {
        for (let target of _targets) {
          const fn = target[method]

          if (fn) {
            fn.apply(target, args)
          } else {
            if (typeof method === 'string') {
              console.warn(`${target.constructor.name} does not support ${method}`)
            }
          }
        }
      }
    }
  }
)
