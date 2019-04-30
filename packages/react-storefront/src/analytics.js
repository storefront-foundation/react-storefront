/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

let _targets = []

/**
 * Configures the PWA to broadcast events to all specified targets.  Once configured, You can call any method on
 * on all targets by calling `analytics.fire(method, ...params)`.
 *
 * Example:
 *
 *  // src/analytics.js
 *
 *  import { configureAnalytics } from 'react-storefront/analytics'
 *  import GoogleTagManagerTarget from 'react-storefront-analytics/GoogleTagManagerTarget'
 *  import MerkleSearchTarget from 'react-storefront-analytics/MerkleSearchTarget'
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
 * analytics.fire('someEvent', { foo: 'bar' }) // this will call the 'someEvent(data)' method on all configured targets and pass { foo: 'bar' } as the data argument.
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

function fire(event, ...args) {
  for (let target of _targets) {
    const fn = target[event]

    if (fn) {
      fn.apply(target, args)
    } else {
      if (typeof event === 'string') {
        console.warn(`${target.constructor.name} does not support ${event}`)
      }
    }
  }
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
 *  import GoogleTagManagerTarget from 'react-storefront-analytics/GoogleTagManagerTarget'
 *  import MerkleSearchTarget from 'react-storefront-analytics/MerkleSearchTarget'
 *
 *  configureAnalytics(
 *    new GoogleTagManagerTarget({ apiKey: 'my_gtm_api_key' }),
 *    new MerkleSearchTarget({ apiKey: 'my_merkle_api_key' })
 *  )
 *
 */

let analytics = { fire }

if (typeof Proxy !== 'undefined') {
  analytics = new Proxy(
    { fire },
    {
      get: function(o, method) {
        if (method === 'fire') {
          return fire
        } else if (method === 'toString') {
          return () => 'AnalyticsProxy'
        } else {
          return fire.bind(null, method)
        }
      },
    },
  )
}

export default analytics
