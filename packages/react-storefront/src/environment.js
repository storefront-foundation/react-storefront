/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Returns `true` only when called on the server.
 * @return {Boolean}
 */
export function isServer() {
  return process.env.MOOV_RUNTIME === 'server'
}

/**
 * Returns `true` only when called on the client.
 * @return {Boolean}
 */
export function isClient() {
  return !isServer()
}
