/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import transformParams from './transformParams'

export default function redirectTo(path) {
  const type = 'redirectTo'
  const runOn = { server: true, client: false }
  const config = (routePath, status) => ({
    redirect: {
      rewrite_path_regex: transformParams(routePath, path),
      ...(status ? { status } : {})
    }
  })
  let responseStatus = 302

  async function fn(params, request, response) {
    let redirectPath = path
    for (let key in params) {
      redirectPath = redirectPath.replace(new RegExp(`{${key}}`, 'g'), params[key])
    }
    response.redirect(redirectPath, responseStatus)
  }

  return {
    type,
    config,
    withStatus: status => {
      responseStatus = status
      return { type, config: routePath => config(routePath, status), runOn, fn }
    },
    runOn,
    fn
  }
}
