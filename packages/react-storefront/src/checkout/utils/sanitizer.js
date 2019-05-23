/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
// Remove spaces
// See this SO post for why this is the fastest way:
// http://stackoverflow.com/questions/5963182/how-to-remove-spaces-from-a-string-using-javascript
export function removeSpaces(str) {
  return str.replace(/\s+/g, '')
}

export function removeSpacesAndLetters(str) {
  return str.replace(/[\sa-zA-Z]+/g, '')
}

export function numeralsOnly(str) {
  return str.replace(/[^0-9]/g, '')
}

export function noExtensionZip(str) {
  // Remove dashes and anything coming after the dash
  const fixed = str.replace(/-.*/g, '')
  // Remove non-digits
  return fixed.replace(/[^\d]+/g, '')
}

export default {
  removeSpaces,
  removeSpacesAndLetters,
  numeralsOnly,
  noExtensionZip
}
