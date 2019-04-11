/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
let _isSafari = null

/**
 * Clears cached results.  Only needed for unit testing.
 * @private
 */
export function clearTestCache() {
  _isSafari = null
}

/**
 * Returns true only in Safari
 * @return {Boolean}
 */
export function isSafari() {
  if (_isSafari == null) {
    _isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent)
  }
  return _isSafari
}
