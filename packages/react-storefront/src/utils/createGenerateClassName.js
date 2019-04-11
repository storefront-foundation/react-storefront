/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { createGenerateClassName as muiCreateGenerateClassName } from '@material-ui/core/styles'

/**
 * Creates a class name generator for JSS.
 * Adapted from https://github.com/cssinjs/jss/blob/master/src/utils/createGenerateClassName.js
 * @param {Boolean} [amp=false] Set to true when rendering amp.  When true, the smaller production class names will be used so
 *  you can tell for sure whether or not your stylesheet is small enough to meet amp's size limit.
 * @return {Function}
 */
export default function createGenerateClassName({ amp = false } = {}) {
  let nextId = 0

  if (amp || process.env.MOOV_ENV === 'production') {
    return (_rule, sheet) => `${sheet.options.classNamePrefix}${nextId++}`
  } else {
    return muiCreateGenerateClassName()
  }
}
