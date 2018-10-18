/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import fetch from 'fetch'

export default function getStatsInDev() {
  return fetch(`http:${env.asset_host}/pwa/stats.json`)
    .then(res => res.json())
}