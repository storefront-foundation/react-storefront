import fetch from '../fetch'
import isBrowser from '../utils/isBrowser'

/**
 * A convenience function to be used in `getInitialProps` to fetch data for the page from an
 * API endpoint at the same path as the page being requested.  So for example, when rendering
 * `/p/1`, this function will fetch data from `/api/p/1`.
 *
 * ```js
 * import fetchFromAPI from 'react-storefront/props/fetchFromAPI'
 * import createLazyProps from 'react-storefront/props/createLazyProps'
 *
 * Product.getInitialProps = createLazyProps(opts => {
 *   return fetchFromAPI(opts)
 * })
 * ```
 *
 * Or simply:
 *
 * ```js
 * Product.getInitialProps = createLazyProps(fetchFromAPI)
 * ```
 *
 * @param {Object} opts The options object provided to `getInitialProps`
 * @return {Promise} A promise that resolves to the data that the page should display
 */
export default function fetchFromAPI({ req, asPath }) {
  const server = !isBrowser()
  const host = server ? req.headers['host'] : ''
  const protocol = server ? (host.startsWith('localhost') ? 'http://' : 'https://') : ''

  if (asPath === '/') asPath = ''

  let uri = `/api${asPath}`

  if (server) {
    if (uri.indexOf('?') === -1) {
      uri = uri + '?_includeAppData=1'
    } else {
      uri = uri + '&_includeAppData=1'
    }
  }

  return fetch(`${protocol}${host}${uri}`).then(res => res.json())
}
