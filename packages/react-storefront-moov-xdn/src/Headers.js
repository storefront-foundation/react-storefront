/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

class HeadersInternal {
  constructor(values = {}) {
    this.headers = {}
    for (let key in values) {
      this.set(key, values[key])
    }
  }
  has(key) {
    return this.headers[key] !== undefined
  }
  append(key, value) {
    if (key == null) throw new Error('key cannot be null in call to headers.append()')
    if (!this.has(key)) {
      this.set(key, value)
    } else {
      this.set(key, this.get(key) + ', ' + value)
    }
  }
  set(key, value) {
    if (key == null) throw new Error('key cannot be null in call to headers.set()')
    this.headers[key.toLowerCase()] = value
  }
  get(key) {
    if (key == null) throw new Error('key cannot be null in call to headers.get()')
    return this.headers[key.toLowerCase()]
  }
  delete(key) {
    delete this.headers[key.toLowerCase()]
  }
  keys() {
    return Object.keys(this.headers)
  }
  entries() {
    return Object.entries(this.headers)
  }
  values() {
    return Object.values(this.headers)
  }
  toJSON() {
    return this.headers
  }
}

const proxy = {
  get: function(target, name) {
    if (target.keys().includes(name)) {
      console.warn(
        'warning: accessing headers directly on the Headers object is deprecated and will be removed in a future version of react-storefront-moov-xdn. Please use headers.get(name) instead'
      )
      return target.get(name)
    }
    return Reflect.get(target, name)
  },
  ownKeys(target) {
    return target.keys()
  },
  set: function(target, name, value) {
    console.warn(
      'warning: setting headers directly on the Headers object is deprecated and will be removed in a future version of react-storefront-moov-xdn. Please use headers.set(name, value) instead'
    )
    target.set(name, value)
    return true
  },
  getOwnPropertyDescriptor() {
    return {
      enumerable: true,
      configurable: true
    }
  }
}

export default function Headers(values = {}) {
  return new Proxy(new HeadersInternal(values), proxy)
}
