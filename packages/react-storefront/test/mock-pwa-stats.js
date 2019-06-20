/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
export default async function getStats() {
  return Promise.resolve({
    assetsByChunkName: {
      main: 'main.js'
    }
  })
}
