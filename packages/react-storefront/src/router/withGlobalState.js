/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/**
 * When doing SSR, returns `globalState` and `localState` merged.  When responding to an AJAX
 * request, only returns `localState`.
 *
 * Example:
 *
 * ```js
 * async function productHandler({ id }, state, request) {
 *   const product = await fetchProductFromUpstreamAPI() // get product info from upstream API
 *   const globalState = () => fetchMenuData() // async function that makes an api call to get menu data.  Will only be called during ssr
 *   return withGlobalState(request, globalState, product)
 * }
 * ```
 *
 * @param {Request} request The request object passed into the handler
 * @param {Object/Function} globalState An object containing data that is needed for all landing pages, such as menu items, navigation, etc..., or a function that returns this data.
 * @param {Object} localState The state being returned for the specific URL being handled.
 * @return {Object} Data to be applied to the state tree.
 */
export default async function withGlobalState(request, globalState, localState) {
  if (request.path.endsWith('.json')) {
    return localState
  } else {
    if (typeof globalState === 'function') {
      globalState = await globalState(request)
    }
    return { ...globalState, ...localState }
  }
}
