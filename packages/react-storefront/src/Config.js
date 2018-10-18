/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Provides access to values set in the blob in Moov Console.
 */
class Config {

  values = {}

  /**
   * Gets a config value
   * @param {String} key 
   * @return {Object}
   */
  get(key) {
    return this.values[key]
  }

  /**
   * Loads values from a JSON blob
   * @param {String/Object} blob A json blob
   */
  load(blob) {
    if (!blob) return 

    if (typeof blob === 'string') {
      blob = JSON.parse(blob)
    }

    this.values = blob
  }

}

const config = new Config()

export default config