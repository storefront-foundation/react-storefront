import fetch from '../fetch'

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
export default function fetchFromAPI({ req, asPath, pathname }) {
  const host = req ? process.env.API_HOST || req.headers['host'] : ''
  const protocol = req ? (host.startsWith('localhost') ? 'http://' : 'https://') : ''
  const [path, search] = asPath.split('?')

  let uri = `/api${path.replace(/\/$/, '')}`

  if (search) {
    uri += `?${search}`
  }

  let headers = {}

  if (req) {
    // on the server
    if (uri.indexOf('?') === -1) {
      uri = uri + '?_includeAppData=1'
    } else {
      uri = uri + '&_includeAppData=1'
    }

    headers = {
      host: req.headers['host'],
      'x-next-page': `/api${pathname.replace(/\/$/, '')}`,
    }
  }

  return fetch(`${protocol}${host}${uri}`, { headers }).then(res => res.json())
}
