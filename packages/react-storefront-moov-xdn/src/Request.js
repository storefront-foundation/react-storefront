/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import getHeaders from "./getHeaders"
import qs from 'qs'
import parseMultipartRequest from './parseMultipartRequest'

/**
 * Creates a request object for route handlers from the moovjs environment.
 * @return {Object}
 */
export default class Request {
  constructor() {
    Object.assign(this, {
      sendResponse: global.sendResponse, 
      body: parseBody(), 
      headers: env.headers ? JSON.parse(env.headers) : getHeaders(), 
      path: pathname, 
      search: search ? `?${search}` : '',
      method: env.method, 
      port: env.host.split(/:/)[1] || (env.secure ? '443' : '80'),
      hostname: env.host_no_port,
      protocol: env.host_no_port === 'localhost' ? 'http:' : env.secure ? 'https:' : 'http:'
    })
  }
}

/**
 * Parses JSON and form body content
 * @private
 * @param {String} body The request body
 * @param {String} contentType The content-type header
 * @return {Object}
 */
function parseBody() {
  const contentType = (request.headers['content-type'] || '').toLowerCase()
  const body = global.requestBody

  if (contentType === 'application/json') {
    try {
      return JSON.parse(body)
    } catch (e) {
      throw new Error('could not parse request body as application/json: ' + e.message)
    }
  } else if (contentType === 'application/x-www-form-urlencoded') {
    try {
      return qs.parse(body)
    } catch (e) {
      throw new Error('could not parse request body as x-www-form-urlencoded: ' + e.message)
    }
  } else if (contentType.startsWith('multipart/form-data')) {
    try {
      return parseMultipartRequest(request)
    } catch (e) {
      throw new Error('could not parse request body as multipart/form-data: ' + e.message)
    }
  }
}
