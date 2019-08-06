/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * @private
 */
class CustomCacheKey {
  headers = []
  queryParametersWhitelist = null
  queryParametersBlacklist = null
  cookies = {}

  addHeader(name) {
    this.headers.push(name)
    return this
  }

  excludeAllQueryParameters() {
    this._preventQueryParametersConflict()

    this.queryParametersWhitelist = []
    return this
  }

  excludeQueryParameters(params) {
    this._preventQueryParametersConflict()

    this.queryParametersBlacklist = params
    return this
  }

  excludeAllQueryParametersExcept(params) {
    this._preventQueryParametersConflict()

    this.queryParametersWhitelist = params
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
      // Only add whitelist OR blacklist. Enforced by _preventQueryParametersConflict()
      ...(this.queryParametersWhitelist && { query_parameters_whitelist: this.queryParametersWhitelist }),
      ...(this.queryParametersBlacklist && { query_parameters_blacklist: this.queryParametersBlacklist }),
    }
  }

  /**
   * @private
   */
  _preventQueryParametersConflict() {
    if (this.queryParametersWhitelist || this.queryParametersBlacklist) {
      throw new Error('You cannot combine multiple query params exclusion in a single custom cache key definition')
    }
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
