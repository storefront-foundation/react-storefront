/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { setImplementation } from 'react-storefront/requestContext'

const implementation = {
  get(key) {
    if (!env.request_context) {
      env.request_context = {}
    }
    return env.request_context[key]
  },
  set(key, value) {
    if (!env.request_context) {
      env.request_context = {}
    }
    env.request_context[key] = value
  }
}

setImplementation(implementation)

export default implementation
