/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
let impl

export function setImplementation(i) {
  impl = i
}

/**
 * Usage:
 *
 * import requestContext from 'react-storefront/requestContext'
 *
 * export default function(params, req, res) {
 *   if (condition) {
 *      requestContext.set('foo', params.foo)
 *   }
 *   res.set('bar', requestContext.get('bar'))
 *   res.json({})
 * }
 */
export default {
  get(...args) {
    if (!impl) {
      console.warn('requestContext implementation not provided, returning undefined')
      return undefined
    }
    return impl.get(...args)
  },
  set(...args) {
    if (!impl) {
      console.warn('requestContext implementation not provided, skipping.')
      return
    }
    impl.set(...args)
  }
}
