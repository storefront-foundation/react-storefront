/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Gets the value of a cookie by name.  Will return undefined if the cookie is present.
 * @param {String} name The name of the cookie
 * @return {String} The value of the cookie
 */
export function getCookie(name) {
  const pairs = document.cookie.split(/;\s*/)

  for (let pair of pairs) {
    let [k, v] = pair.split('=')

    if (decodeURIComponent(k) === name) {
      return decodeURIComponent(v)
    }
  }

  return undefined
}
