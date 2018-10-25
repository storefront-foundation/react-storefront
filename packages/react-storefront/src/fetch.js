/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { isString, merge } from 'lodash'
import URL from 'url'
import qs from 'qs'

function isFormUrlEncoded(contentType) {
  return contentType && contentType.indexOf('x-www-form-urlencoded') >= 0
}

/**
 * Creates options for a fetch call
 * @param {String} url The URL to fetch
 * @param {Object} options fetch options
 * @param {String} qsOptions Options for serializing the request body using the qs package
 */
function createRequestOptions(url, fetchOptions = {}, qsOptions) {
  let { body, headers = {}, method, ...options } = fetchOptions

  if (body) {
    method = method || 'POST'

    // Only apply stringifiying when body is not a string already
    if (!isString(body)) {
      if (isFormUrlEncoded(headers['content-type'])) {
        body = qs.stringify(body, qsOptions)
      } else {
        body = JSON.stringify(body)
        headers['content-type'] = 'application/json'
      }
    }

    headers['content-length'] = Buffer.byteLength(body)
  }

  const { hostname, port, path } = URL.parse(url)

  return {
    ...options,
    method,
    body,
    hostname,
    port,
    path,
    headers,
    rejectUnauthorized: false,
    requestCert: true
  }
}

/**
 * The same as fetch, but automatically relays the cookies passed in from the browser to the upstream API.
 * @param {String} url The url to fetch
 * @param {Object} options Options for fetch
 * @param {String} qsOptions Options for serializing the request body using the qs package
 * @return {Promise}
 */
export function fetchWithCookies(url, options = {}, qsOptions) {
  const headers = {}

  if (env.cookie && env.shouldSendCookies !== false) {
    headers.cookie = env.cookie
  }

  return fetch(url, merge(options, {
    credentials: "include",
    headers
  }), qsOptions)
}

/**
 * An implementation of the standard fetch API.  See https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API for options
 * @param {String} url 
 * @param {Object} options Options for fetch
 * @param {String} qsOptions Options for serializing the request body using the qs package
 * @return {Promise}
 */
export default function fetch(url, options, qsOptions) {
  return new Promise((resolve, reject) => {
    const protocol = url.match(/^https/) ? global.https : global.http
    const { body, ...requestOptions } = createRequestOptions(url, options, qsOptions)

    // Moov should inject this via the Server component
    const req = protocol.request(requestOptions, response => {
      let data = []
      response.setEncoding('utf8')

      relaySetCookies(response, requestOptions.hostname)

      response.on('data', chunk => data.push(chunk))

      response.on('end', () => {
        data = data.join('')

        const ok = response.statusCode >= 200 && response.statusCode <= 299

        if ([301, 302].includes(response.statusCode) && response.headers.location) {
          const redirectData = {
            redirect: response.headers.location
          }

          return resolve({
            status: response.statusCode,
            ok: true,
            headers: response.headers,
            text: () => Promise.resolve(JSON.stringify(redirectData)),
            json: () => Promise.resolve(redirectData),
          })
        }

        const result = {
          status: response.statusCode,
          ok,
          headers: response.headers,
          text: () => Promise.resolve(data),
          json: () => Promise.resolve(JSON.parse(data)),
        }

        if (!ok) {
          const error = new Error(`${response.statusCode}: ${data}`)
          error.response = result
          reject(error)
          return
        }

        // Recreating simple API similar to Fetch
        // https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API
        resolve(result)
      })
    })

    req.on('error', err => {
      reject(err)
    })

    // do not break request when we have no data
    if (body) {
      req.write(body)
    }

    req.end()    
  })
}

/**
 * Adds a set-cookie header to env.MUR_SET_COOKIES so we can relay it to the browser in Response.send
 * This is the mechanism by which we propagate sessions created in MUR requests.
 * @param {Object} request The request object
 * @param {String} domain The request hostname
 */
function relaySetCookies(request, domain) {
  const cookie = request.headers['set-cookie']
  
  if (cookie) {
    const cookies = env.MUR_SET_COOKIES || {}
    cookies[domain] = (cookies[domain] || []).concat(cookie)
    fns.export('MUR_SET_COOKIES', cookies)
  }
}

/**
 * Returns headers that will allow fetch to ignore servers that don't have a valid certificate.
 * This can be used to connect to servers that use a self signed certificate but should 
 * not be used in production.
 * 
 * Example usage:
 * 
 *  fetch('https://example.com', {
 *    headers: {
 *      ...acceptInvalidCerts(),
 *      // other headers here
 *    }
 *  })
 * 
 * @return {Object} An object to spread onto fetch headers
 */
export function acceptInvalidCerts() {
  return { agent: new https.Agent({rejectUnauthorized: false}) }
}