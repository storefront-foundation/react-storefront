/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * A handler that can be run on the client.  It will also be run on the server during server-side rendering.
 *
 * Example:
 *
 * ```js
 * router.get('/p/:id',
 *   fromClient({ view: 'Product' }),
 * 	 fromServer('./product/Product')
 * )
 * ```
 *
 * @param {Function/Object} callback A function that takes the route params and returns an
 *  object to apply to the app state, or simply an object to apply to the app state. The
 *  shape of the object should match your `AppModel`.
 * @return {Object} A handler spec
 */
export default function fromClient(callback) {
  let fn

  if (typeof callback === 'function') {
    fn = (...args) => {
      const result = callback(...args)

      if (result.then) {
        // function that returns a promise that resolves to a patch
        return result
      } else {
        // function that results a patch
        return Promise.resolve(result)
      }
    }
  } else {
    // a static patch
    fn = Promise.resolve(callback)
  }

  return {
    type: 'fromClient',
    runOn: {
      server: 'ssr', // indicates to the router that this handler should only be run on the server when returning html (and not when returning json)
      client: true
    },
    fn
  }
}
