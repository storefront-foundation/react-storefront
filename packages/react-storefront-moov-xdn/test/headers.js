let values = {}
let statusCode = 200

/**
 * Mock for the moovjs headers namespace
 */
const headers = {
  header(name, value) {
    if (typeof value !== 'undefined') {
      headers.addHeader(name, value)
    } else {
      return values[name.toLowerCase()]
    }
  },

  headerKeys() {
    return Object.keys(values)
  },

  removeAllHeaders(name) {
    delete values[name.toLowerCase()]
  },

  addHeader(name, value) {
    values[name.toLowerCase()] = value
  },

  set statusCode(code) {
    statusCode = code
  },

  get statusCode() {
    return statusCode
  }
}

export default headers

/**
 * Resets the state of headers
 */
export function reset() {
  values = {}
  statusCode = 200
}