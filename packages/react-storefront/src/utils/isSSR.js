/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

import { isServer } from '../environment'

/**
 * Returns `true` when rendering on the server and during initial hydration on the client
 * @return {Boolean}
 */
export default function isSSR() {
  if (isServer()) {
    return true
  } else {
    return window.moov && !window.moov.hydrated ? true : false
  }
}
