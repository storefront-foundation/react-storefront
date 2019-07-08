/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * @private
 */
class CustomCacheKey {
  headers = []
  removeQueryParameters = []
  cookies = {}

  addHeader(name) {
    this.headers.push(name)
    return this
  }

  removeQueryParameter(name) {
    this.removeQueryParameters.push(name)
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
      remove_query_parameters: this.removeQueryParameters,
      add_cookies: this.cookies
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
 *            .removeQueryParameter('uid')
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
