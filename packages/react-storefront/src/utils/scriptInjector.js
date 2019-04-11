/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * Method for checking script tag in <head>
 * @param {String} src path to script
 */
function isScriptInjected(src) {
  if (typeof document === 'undefined') {
    return false
  }
  const injectedScripts = [...document.querySelectorAll(`script[src^="${src}"]`)]
  return injectedScripts.length > 0
}

/**
 * Method for checking script tag in <head>
 * @param {String} code script code
 */
function isCodeInjected(code) {
  if (typeof document === 'undefined') {
    return false
  }
  const injectedCodes = [...document.head.getElementsByTagName('script')].filter(
    el => el.innerHTML === code,
  )
  return injectedCodes.length > 0
}

/**
 * Method for injecting script tag in <head>
 * @param {String} src path to script
 * @param {Object} [params] Optional params
 * @param {Object} [params.attrs={}] Optional attributes to add to element
 * @param {Boolean} [params.once=true] If true then script will be injected only once
 * @returns {Promise} Promise returns on script's onload event
 */
export function injectScriptInHead(src, { attrs = {}, once = true } = {}) {
  if (once && isScriptInjected(src)) {
    return Promise.resolve()
  }
  if (typeof document === 'undefined') {
    return Promise.resolve()
  }
  let promiseResponse
  const scriptHeadElement = document.createElement('script')
  scriptHeadElement.src = src
  Object.keys(attrs).forEach(key => {
    scriptHeadElement.setAttribute(key, attrs[key])
  })

  promiseResponse = new Promise((resolve, reject) => {
    scriptHeadElement.onload = resolve
    scriptHeadElement.onerror = reject
  })

  document.head.appendChild(scriptHeadElement)

  return promiseResponse
}

/**
 * Method for injecting target code in <head>
 * @param {String} code script code
 * @param {Object} [params] optional params
 * @param {Boolean} [params.once=false] If true then script will be injected only once
 */
export function injectCodeInHead(code, { once = true } = {}) {
  if (once && isCodeInjected(code)) {
    return
  }
  if (typeof document === 'undefined') {
    return
  }
  const scriptHeadElement = document.createElement('script')
  scriptHeadElement.appendChild(document.createTextNode(code))

  document.head.appendChild(scriptHeadElement)
}

/**
 * Method for removing script in <head>
 * @param {String} src path to script
 */
export function removeScriptInHead(src) {
  ;[...document.querySelectorAll(`script[src^="${src}"]`)].forEach(el =>
    el.parentNode.removeChild(el),
  )
}

/**
 * Method for removing code  in <head>
 * @param {String} code script code
 */
export function removeCodeInHead(code) {
  ;[...document.head.getElementsByTagName('script')]
    .filter(el => el.innerHTML === code)
    .forEach(el => el.parentNode.removeChild(el))
}

const scriptInjector = {
  injectScriptInHead,
  injectCodeInHead,
  removeScriptInHead,
  removeCodeInHead,
}
export default scriptInjector
