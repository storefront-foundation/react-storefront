import React from 'react'
import { NextScript } from 'next/document'

/**
 * Adds script elements for Next.js static assets with defer instead of async
 * to improve paint metrics in lighthouse.
 *
 * This should be used in the body of `pages/_document.js` in place of `NextScript`.
 */
export default class NextScriptDeferred extends NextScript {
  getScripts() {
    return super.getScripts().map(script => {
      return React.cloneElement(script, {
        key: script.props.src,
        defer: true,
        async: undefined,
      })
    })
  }
}
