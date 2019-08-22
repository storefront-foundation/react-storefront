/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { clearCache } from './router/serviceWorker'

/**
 * Clears all API and SSR responses from the client cache
 * @return {Promise} resolved once the cache has been cleared
 */
export function clearClientCache() {
  return clearCache()
}
