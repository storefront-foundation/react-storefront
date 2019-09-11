/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Gets the version number that identifies the browser caches corresponding to the current
 * build of the app.  We use this to prevent fetching from caches that were populated
 * by previous versions of the app and therefore may contain responses that are no
 * longer compatible with the current version of the app.
 * @private
 * @return {String}
 */
export default function getAPIVersion() {
  return (window.moov || {}).apiVersion
}
