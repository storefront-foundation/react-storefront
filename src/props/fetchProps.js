import fetch from 'isomorphic-unfetch'

/**
 * Creates a `getInitialProps` props function that fetches props from an API endpoint. Use this
 * in conjunction with [`useLazyStore`](/apiReference/hooks%2fuseLazyStore) to display a skeleton
 * with partial data while fetching the full data for the page from the server.
 *
 * The returned function will skip displaying the skeleton if the API response can be served from
 * the browser's cache.
 *
 * Example:
 *
 * ```js
 * import useLazyStore from 'react-storefront/hooks/useLazyStore'
 * import fetchProps from 'react-storefront/props/fetchProps'
 *
 * function Product(lazyProps) {
 *   const [store, updateStore] = useLazyStore(lazyProps)
 *   const { product } = store.pageData
 *
 *   // store.loading will be true while fetching product data from the server
 *
 *   // store.pageData will be populated with the `pageData` prop provided to the <Link> element
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
 * Product.getInitialProps = withCaching({
 *   browser: true
 *   edge: {
 *     maxAgeSeconds: 1000,
 *     key: createCustomCacheKey().addCookie('currency')
 *   }
 * })(fetchProps(({ query }) => `/api/p/${encodeURIComponent(query.productId)}`))
 * ```
 *
 * @param {Function} createApiUrl A function to use to create the URL
 * @param {Object} options
 * @param {Object} options.showSkeletonsAfterMS The max duration to wait before resolving so that the page
 *  component will be rendered and can display a skeleton
 */
export default function fetchProps(createApiUrl, { showSkeletonsAfterMS = 50 } = {}) {
  return options => {
    const server = typeof window === 'undefined'
    const host = server ? options.req.headers['host'] : ''
    const protocol = server ? (host.startsWith('localhost') ? 'http://' : 'https://') : ''
    const apiURL = `${protocol}${host}${createApiUrl(options)}`

    return createLazyProps(options.asPath, apiURL, {
      shell: options.rsf_app_shell === '1',
      showSkeletonsAfterMS,
    })
  }
}

async function createLazyProps(as, apiURL, { shell, showSkeletonsAfterMS = 50 } = {}) {
  if (typeof window === 'undefined') {
    if (apiURL.indexOf('?') === -1) {
      apiURL = apiURL + '?_includeAppData=1'
    } else {
      apiURL = apiURL + '&_includeAppData=1'
    }
  }

  const fetchFromAPI = () =>
    fetch(apiURL, {
      headers: {
        'x-rsf-api-version': process.env.RSF_API_VERSION,
      },
    })

  if (typeof window === 'undefined') {
    // server
    if (shell) {
      return { lazy: apiURL }
    } else {
      return (await fetchFromAPI()).json()
    }
  } else {
    // client
    const { rsf } = window.history.state

    if (rsf && rsf[as]) {
      // going back or forward
      /* this is written useLazyStore's recordState function when the user navigates (not back) */
      return {
        pageData: rsf[as],
      }
    } else {
      return new Promise((resolve, reject) => {
        const fetchPromise = fetchFromAPI().then(res => res.json())

        let resolved = false

        setTimeout(() => {
          if (!resolved) {
            resolved = true
            resolve({ lazy: fetchPromise })
          }
        }, showSkeletonsAfterMS)

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
