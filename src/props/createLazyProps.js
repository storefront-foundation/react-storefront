/**
 * Creates a function for next's `getInitialProps` that returns "lazy" props after a maximum `timeout` that
 * defaults to 50ms. This function should be used in conjunction with `hooks/useLazyState` in the component
 * to display a skeleton until page data is returned from the network.
 *
 * During client-side navigation, this allows the page component to render before the fetched data is returned from the server.
 * This gives us an opportunity to display a skeleton when the network is slow.  On a fast network or when the response is
 * cached in the browser, and thus returns within the configured timeout, the fetched data will be available for the page's
 * initial render, and we can skip the skeleton.
 *
 * When rendering on the server, the timeout is not enforced.  This function simply waits for the network and returns
 * once data is received.
 *
 * Example:
 *
 * ```js
 * import useLazyState from 'react-storefront/hooks/useLazyState'
 * import fetchProps from 'react-storefront/props/fetchProps'
 * import fetchFromAPI from 'react-storefront/props/fetchFromAPI'
 *
 * function Product(lazyProps) {
 *   const [state, updateState] = useLazyState(lazyProps)
 *   const { product } = state.pageData
 *
 *   // state.loading will be true while fetching product data from the server
 *
 *   // state.pageData will be populated with the `pageData` prop provided to the <Link> element
 *   // that was clicked.  In this way you can provide partial data to a page.  For example:
 *   //
 *   // <Link href="/p/[productId]" as={`/p/${product.id}`} pageData={{ product }}>{product.name}</Link>
 *
 *   return (
 *     <Grid container spacing={4}>
 *       <Grid item xs={12}>
 *         { product.name ? <Typography variant="h1">{product.name}</Typography> : <Skeleton style={{ height: 16 }}/> }
 *       </Grid>
 *       // render the rest of the PDP
 *     </Grid>
 *   )
 * }
 *
 * Product.getInitialProps = createLazyProps(opts => {
 *   return fetchFromAPI(opts)
 * }, { timeout: 50 })
 * ```
 *
 * @param {Function} createApiUrl A function to use to create the URL
 * @param {Object} options
 * @param {Object} options.timeout The max duration to wait before resolving so that the page
 *  component will be rendered and can display a skeleton while waiting for the promise returned
 *  by `fetchCallback` to resolve
 */
export default function createLazyProps(fetchCallback, { timeout = 50 } = {}) {
  return (options /* from getInitialProps */) => {
    if (typeof window === 'undefined') {
      // server
      return fetchCallback(options)
    } else {
      // client
      const { rsf } = window.history.state

      if (rsf && rsf[options.asPath]) {
        // going back or forward
        /* this is written useLazyState's recordState function when the user navigates (not back) */
        return {
          pageData: rsf[options.asPath],
        }
      } else {
        return new Promise((resolve, reject) => {
          const fetchPromise = fetchCallback(options)

          let resolved = false

          setTimeout(() => {
            if (!resolved) {
              resolved = true
              resolve({ lazy: fetchPromise })
            }
          }, timeout)

          fetchPromise
            .then(result => {
              if (!resolved) {
                resolved = true
                resolve(result)
              }
            })
            .catch(e => {
              reject(e)
            })
        })
      }
    }
  }
}
