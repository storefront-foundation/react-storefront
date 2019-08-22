/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */

import postcss from 'postcss'
import autoprefixer from 'autoprefixer'
import CleanCSS from 'clean-css'

const prefixer = postcss([autoprefixer])
const cleanCSS = new CleanCSS()

/**
 * Add prefixes and minify given CSS
 */
export default async function minifyStyles(css) {
  const prefixed = await prefixer.process(css, { from: undefined })
  return cleanCSS.minify(prefixed.css).styles
}
