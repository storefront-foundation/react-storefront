/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import fs from 'fs'
import path from 'path'

const STATS_PATH = path.join(process.env.RSF_APP_ROOT, 'build', 'assets', 'pwa', 'stats.json')

export default function getStatsFromFileSystem() {
  try {
    const stats = JSON.parse(fs.readFileSync(STATS_PATH, 'utf8'))
    return Promise.resolve(stats)
  } catch (e) {
    console.log('error', e)
  }
}
