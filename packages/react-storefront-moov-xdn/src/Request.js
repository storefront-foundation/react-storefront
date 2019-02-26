/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import qs from 'qs'
import parseMultipartRequest from './parseMultipartRequest'
import Headers from './Headers'
import getHeaders from "./getHeaders"

/**
 * Creates a request object for route handlers from the moovjs environment.
 * @return {Object}
 */
export default class Request {
  
  constructor() {
    const [path, search] = env.path.split(/\?/)

    Object.assign(this, {
      sendResponse: global.sendResponse, 
      headers: new Headers(env.headers ? JSON.parse(env.headers) : getHeaders()), 
      path, 
      search: search ? `?${search}` : '',
      query: qs.parse(search),
      method: env.method, 
      port: env.host.split(/:/)[1] || (env.secure ? '443' : '80'),
      hostname: env.host_no_port,
      protocol: env.host_no_port === 'localhost' ? 'http:' : env.secure ? 'https:' : 'http:'
    })

    this.body = parseBody(this)
  }

  get pathname() {
    console.warn('warning: request.pathname is deprecated and will be removed in a future version of react-storefront-moov-xdn')
    return this.path
  }

}

/**
 * Parses JSON and form body content
 * @private
 * @param {String} body The request body
 * @param {String} contentType The content-type header
 * @return {Object}
 */
function parseBody(request) {
  const contentType = (request.headers.get('content-type') || '')

  // MIME types should be matched as case insesitive, but we need to pass the original
  // content-type value when parsing multi-part form data so that the boundary is
  // correctly matched.
  const contentTypeLowerCase = contentType.toLowerCase() 
  
  const body = global.requestBody

  if (contentTypeLowerCase === 'application/json') {
    try {
      return JSON.parse(body)
    } catch (e) {
      throw new Error('could not parse request body as application/json: ' + e.message)
    }
  } else if (contentTypeLowerCase === 'application/x-www-form-urlencoded') {
    return qs.parse(body)
  } else if (contentTypeLowerCase.startsWith('multipart/form-data')) {
    try {
      return parseMultipartRequest(body, contentType)
    } catch (e) {
      throw new Error('could not parse request body as multipart/form-data: ' + e.message)
    }
  }
}
