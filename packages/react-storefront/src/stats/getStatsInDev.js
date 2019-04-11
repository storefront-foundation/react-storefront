/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
const fetch = require('fetch').default

module.exports = function getStatsInDev() {
  return fetch(`http:${env.asset_host}/pwa/stats.json`).then(res => res.json())
}
