/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */

import transformParams from './transformParams'

async function fn(params, request, response) {
  throw new Error('fromOrigin is only supported when running in the Moovweb XDN.')
}

export default function fromOrigin(backend) {
  const type = 'fromOrigin'
  const config = {
    proxy: {
      backend
    }
  }
  const runOn = { server: true, client: false }

  return {
    type,
    runOn,
    config: () => config,
    transformPath: path => {
      return {
        type,
        runOn,
        config: routePath => {
          config.proxy.rewrite_path_regex = transformParams(routePath, path)
          return config
        },
        fn
      }
    },
    fn
  }
}
