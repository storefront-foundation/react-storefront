/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
export default function getStats() {
  try {
    return Promise.resolve(require('/build/stats.json'))
  } catch (e) {
    return require('./getStatsInDev').default()
  }
}