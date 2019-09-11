/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * The default settings for the client (service worker) cache config.
 */
export default {
  cacheName: 'runtime',
  maxEntries: 200,
  maxAgeSeconds: 60 * 60 * 24
}
