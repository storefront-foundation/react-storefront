/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

import flatten from 'lodash/flatten'
/**
 * @private
 */
const QS_MODE_BLACKLIST = 'blacklist'
const QS_MODE_WHITELIST = 'whitelist'
class CustomCacheKey {
  headers = []

  queryParametersMode = QS_MODE_BLACKLIST
  queryParameterslist = []
  queryParametersChanged = false

  cookies = {}

  addHeader(name) {
    this.headers.push(name)
    return this
  }

  excludeAllQueryParameters() {
    this._preventQueryParametersConflict()

    this.queryParametersMode = QS_MODE_WHITELIST
    this.queryParameterslist = []
    return this
  }

  excludeQueryParameters(...params) {
    this._preventQueryParametersConflict()

    this.queryParametersMode = QS_MODE_BLACKLIST
    this.queryParameterslist = this._convertArgsToArray(params)
    return this
  }

  excludeAllQueryParametersExcept(...params) {
    this._preventQueryParametersConflict()

    this.queryParametersMode = QS_MODE_WHITELIST
    this.queryParameterslist = this._convertArgsToArray(params)
    return this
  }

  addCookie(name, createPartitions) {
    const cookie = new CookieConfig()

    if (typeof createPartitions === 'function') {
      createPartitions(cookie)
    }

    this.cookies[name] = cookie.toJSON()

    return this
  }

  toJSON() {
    return {
      add_headers: this.headers,
      add_cookies: this.cookies,
      query_parameters_mode: this.queryParametersMode,
      query_parameters_list: this.queryParameterslist,
    }
  }

  /**
   * @private
   */
  _preventQueryParametersConflict() {
    if (this.queryParametersChanged) {
      throw new Error('You cannot combine multiple query params exclusion in a single custom cache key definition')
    }
    this.queryParametersChanged = true
  }

  /**
   * Some function can be called with both an array or spread arguments.
   * ex: excludeAllQueryParameters('uid', 'utm_source') or excludeAllQueryParameters([uid', 'utm_source'])
   * @param {@} args
   */
  _convertArgsToArray(args) {
    return flatten(args)
  }
}

/**
 * @private
 */
class CookieConfig {
  partitions = []
  name = null

  partition(name) {
    const partition = new PartitionConfig(name)
    this.partitions.push(partition)
    return partition
  }

  toJSON() {
    if (this.partitions.length === 0) {
      return null
    } else {
      return this.partitions.map(p => p.toJSON())
    }
  }
}

/**
 * @private
 */
class PartitionConfig {
  pattern = null
  name = null

  constructor(name) {
    this.name = name
  }

  byPattern(pattern) {
    this.pattern = pattern
  }

  toJSON() {
    return {
      partition: this.name,
      partitioning_regex: this.pattern
    }
  }
}

/**
 * Returns a DSL for creating custom server cache keys based on cookies, query parameters, and
 * request headers.
 *
 * example:
 *
 * ```js
 *  new Router()
 *    .get('/s/:id',
 *      cache({
 *        server: {
 *          key: createCustomCacheKey()
 *            .addHeader('user-agent')
 *            .excludeQueryParameters(['uid'])
 *            .addCookie('location', cookie => {
 *              cookie.partition('na').byPattern('us|ca')
 *              cookie.partition('eur').byPattern('de|fr|ee')
 *            })
 *        }
 *      })
 *    )
 * ```
 */
export default function createCustomCacheKey() {
  return new CustomCacheKey()
}
