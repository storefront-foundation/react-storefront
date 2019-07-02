/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * If the provided argument is a string, returns a function that parses the string as JSON,
 * otherwise returns the provided argument.
 * @param {String|Object} state
 * @return {Object|Function}
 */
export function lazyState(state) {
  if (typeof state === 'string') {
    return () => JSON.parse(state)
  } else {
    return state
  }
}

/**
 * If the provided argument is a string, parses it as JSON and returns the resulting object,
 * otherwise returns the provided argument.
 * @param {String|Object} state
 * @return {Object}
 */
export function parseState(state) {
  if (typeof state === 'string') {
    return JSON.parse(state)
  } else {
    return state
  }
}
