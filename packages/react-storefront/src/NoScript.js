/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React from 'react'

/**
 * A simple wrapper for HTML noscript that is testable in enzyme.  This is
 * needed since enzyme won't render the contents of a noscript element.
 * @param {*} props
 */
export default function NoScript(props) {
  if (process.env.NODE_ENV === 'test') {
    return <div {...props} />
  } else {
    return <noscript {...props} />
  }
}
