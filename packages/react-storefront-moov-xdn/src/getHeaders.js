/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Gathers up all request headers into an object.
 * @return {Object} An object of request header name => value
 */
export default function() {
  const requestHeaders = {};

  for (let key of headers.headerKeys()) {
    requestHeaders[key] = headers.header(key);
  }

  return requestHeaders;
}