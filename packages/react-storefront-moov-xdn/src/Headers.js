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
    this[key.toLowerCase()] = value // this is needed for spreading like: { ...headers }
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
    return { ...this.headers }
  }
  toString() {
    return JSON.stringify(this.headers)
  }
}

const proxy = {
  get: function(target, name) {
    if (target.keys().includes(name)) {
      return target.get(name)
    }
    return Reflect.get(target, name)
  },
  ownKeys(target) {
    return target.keys()
  },
  set: function(target, name, value) {
    target.set(name, value)
    return true
  },
  deleteProperty: function(target, name) {
    target.delete(name)
    return true
  }
}

export default function Headers(values = {}) {
  return new Proxy(new HeadersInternal(values), proxy)
}
