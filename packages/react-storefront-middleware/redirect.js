/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
const { cache } = require('./cache')

/**
 * Returns true if the request is a post from an amp page, otherwise false
 * @return {Boolean}
 */
function isAmpPost(req) {
  const referer = req.get('Referer')
  return referer && referer.split('?')[0].endsWith('.amp') && req.method.toLowerCase() === 'post'
}

/**
 * Sends an http redirect.
 * @param {Request} req Express Request
 * @param {Response} res Express Response
 * @param {String} url The destination url.  Can be relative or absolute.
 * @param {Number} statusCode The status code to send.  Defaults to 301
 */
function redirectTo(req, res, url, statusCode = 301) {
  const referer = req.get('Referer')
  const protocol = (referer && referer.split(/:/)[0]) || 'https'

  if (!url.match(/https?:\/\//)) {
    url = `${protocol}://${req.hostname}${url}`
  }

  if (isAmpPost(req)) {
    res.set('amp-redirect-to', url)
    res.set(
      'access-control-expose-headers',
      'AMP-Access-Control-Allow-Source-Origin,AMP-Redirect-To'
    )
    res.set('amp-access-control-allow-source-origin', `${protocol}://${req.hostname}`)
  } else {
    // res.removeHeader('Location')
    res.set('Location', url)
    res.status(statusCode)
  }

  cache(res, { serverMaxAge: 0, browserMaxAge: 0 })
}

/**
 * Redirects the browser to the same URL but on https.
 */
function redirectToHttps(req, res) {
  redirectTo(req, res, `https://${req.hostname}${req.path}`)
}

module.exports = {
  redirectTo,
  redirectToHttps
}
