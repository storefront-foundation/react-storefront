/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { cache } from './cache'

/**
 * Returns true if the request is a post from an amp page, otherwise false
 * @return {Boolean}
 */
function isAmpPost() {
  const { referer } = env

  return (
    referer && 
    referer.split('?')[0].endsWith('.amp') &&
    env.method.toLowerCase() === 'post'
  )
}

/**
 * Sends an http redirect.
 * @param {String} url The destination url.  Can be relative or absolute.
 * @param {Number} statusCode The status code to send.  Defaults to 301
 */
export function redirectTo(url, statusCode=301) {
  const protocol = (env.referer && env.referer.split(/:/)[0]) || 'https'

  if (!url.match(/https?:\/\//)) {
    url = `${protocol}://${env.host}${url}`
  }

  if (isAmpPost()) {
    headers.addHeader("amp-redirect-to", url)
    headers.addHeader("access-control-expose-headers", "AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To")
    headers.addHeader("amp-access-control-allow-source-origin", `${protocol}://${env.host}`)
  } else {
    headers.removeAllHeaders("Location")
    headers.addHeader("Location", url)
    headers.statusCode = statusCode
  }

  cache({ serverMaxAge: 0, browserMaxAge: 0 })
}

/**
 * Redirects the browser to the same URL but on https.
 */
export function redirectToHttps() {
  redirectTo(`https://${env.host}${env.path}`)
}