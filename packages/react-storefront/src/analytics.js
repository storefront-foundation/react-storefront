/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

let _targets = []

// When false, any fired events will be put in a queue until activate() is called
let activated = false

// events accumulate here when activated is false
const queue = []

/**
 * Configures the PWA to broadcast events to all specified targets.  Once configured, You can call any method on
 * on all targets by calling `analytics.fire(method, ...params)`.
 *
 * Example:
 *
 * ```js
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
 * ```
 *
 * Then, to broadcast an analytics event to all targets:
 *
 * ```js
 * import analytics from 'react-storefront/analytics'
 *
 * // this will call the 'someEvent(data)' method on all configured targets and pass { foo: 'bar' } as the data argument.
 * analytics.fire('someEvent', { foo: 'bar' })
 * ```
 * @private
 * @param {AnalyticsTarget[]} targets An array of targets to notify when analytics events occur
 * @return {AnalyticsProvider}
 */
export function configureAnalytics(...targets) {
  _targets = targets
}

/**
 * @private
 */
export function getTargets() {
  return _targets
}

/**
 * Stops queuing and immediatley fires all queued events
 * @private
 */
export function activate() {
  activated = true

  for (let call of queue) {
    fire(call.event, ...call.args)

    if (process.env.NODE_ENV === 'development') {
      console.log('[analytics]', 'sending queued event', call.event, ...call.args)
    }
  }
}

function fire(event, data, ...args) {
  if (typeof document !== 'undefined' && !data.metadata) {
    Object.assign(data, {
      metadata: {
        title: document.title,
        pathname: location.pathname,
        search: location.search,
        uri: location.pathname + location.search,
        referrer: document.referrer
      }
    })
  }

  args = [data, ...args]

  if (activated) {
    for (let target of _targets) {
      const fn = target[event]

      if (fn) {
        try {
          fn.apply(target, args)
        } catch (e) {
          console.warn(
            'Error thrown by analytics target, event=',
            event,
            'target=',
            target,
            'args=',
            args,
            e
          )
        }
      } else {
        if (typeof event === 'string') {
          console.warn(`${target.constructor.name} does not support ${event}`)
        }
      }
    }
  } else {
    queue.push({ event, args })
  }
}

/**
 * This module's default export is an `EventEmitter` for broadcasting analytics events to all targets configured via `<AnalyticsProvider>`.
 *
 * Example:
 *
 * ```js
 * import analytics from 'react-storefront/analytics'
 *
 * // this will call the 'someEvent(data)' method on all configured targets and pass { foo: 'bar' } as the data argument.
 * analytics.fire('someEvent', { foo: 'bar' })
 * ```
 *
 * @type {EventEmitter}
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
      }
    }
  )
}

export default analytics
