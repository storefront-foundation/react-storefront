/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Copies all set-cookie response headers received in fetch calls in the fromServer handler
 * onto the response sent back to the browser.  Use propagateCookies to propagate new sessions
 * from the upstream API call back to the user.
 * 
 * @param {Function} [handler] Optional function that is passed the set cookie headers as an array.  
 *  If specified, default behavior is overridden and you are responsible for copying the set cookie 
 *  headers onto the response using response.set('set-cookie', value)
 * 
 * @return {Object} A handler definition
 * 
 *  Examples: 
 * 
 *  To get the default behavior, simply:
 * 
 *    propagateCookies()
 * 
 *  To implement your own cookie propagation logic:
 *  
 *    propagateCookies((params, request, response, cookies) => {
 *      for (let cookie of cookies) {
 *        response.set('set-cookie', cookie)
 *      }
 *    })
 * 
 */
export default function propagateCookies(handler) {
  return {
    type: 'fromServer',
    runOn: {
      server: true,
      client: false
    },
    fn: (params, request, response) => {
      let cookies = global.env.SET_COOKIE // set by react-storefront/fetch
  
      if (!cookies) return

      if (handler) {
        handler(params, request, response, cookies)
      } else {
        for (let cookie of cookies) {
          response.set('set-cookie', cookie)
        }
      }
    }
  }
}