/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import fromClient from './fromClient'

/**
 * Specifies the page component that should be displayed when a route is matched.
 * @param {String} componentKey A key in the `components` prop in the `Pages` element in `src/App.js`.
 * @return {Object}
 */
export default function page(componentKey) {
  return fromClient({ page: componentKey })
}
