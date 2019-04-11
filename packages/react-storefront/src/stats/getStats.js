/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
export default function getStats() {
  return Promise.resolve(require('/build/stats.json'))
}
