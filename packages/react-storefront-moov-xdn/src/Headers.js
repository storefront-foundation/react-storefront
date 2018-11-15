/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
export default class Headers {

  constructor(values = {}) {
    for (let key in values) {
      this.set(key, values[key])
    }
  }

  get(key) {
    if (key == null) throw new Error('key cannot be null in call to headers.get()')
    return this[key.toLowerCase()]
  }

  set(key, value) {
    if (key == null) throw new Error('key cannot be null in call to headers.set()')
    this[key.toLowerCase()] = value
  }

}
