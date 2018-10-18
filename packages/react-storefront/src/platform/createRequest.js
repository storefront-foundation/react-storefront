/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import getHeaders from "./getHeaders"

/**
 * Creates a request object for route handlers from the moovjs environment.
 * @return {Object}
 */
export default function createRequest() {
  const [ pathname, search ] = env.path.split(/\?/)

  return {
    sendResponse: global.sendResponse, 
    body: global.requestBody, 
    headers: env.headers ? JSON.parse(env.headers) : getHeaders(), 
    pathname, 
    search: search ? `?${search}` : '',
    method: env.method, 
    port: env.host.split(/:/)[1] || (env.secure ? '443' : '80'),
    hostname: env.host_no_port,
    protocol: env.host_no_port === 'localhost' ? 'http:' : env.secure ? 'https:' : 'http:',
    get path() {
      console.warn('warning: request.path is deprecated and will be removed in a future version of react-storefront')
      return env.path
    }
  }
}