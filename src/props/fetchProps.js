import fetch from 'isomorphic-unfetch'
import { waitForServiceWorker } from '../serviceWorker'

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
 */
export default function fetchProps(createApiUrl) {
  return options => {
    const server = typeof window === 'undefined'
    const host = server ? options.req.headers['host'] : ''
    const protocol = server ? (host.startsWith('localhost') ? 'http://' : 'https://') : ''
    const apiURL = `${protocol}${host}${createApiUrl(options)}`
    return createLazyProps(options.asPath, apiURL, options.rsf_app_shell === '1')
  }
}

let serviceWorkerReady = false
let requestId = 0

function nextRequestId() {
  return requestId++
}

if (typeof window !== 'undefined') {
  waitForServiceWorker().then(() => {
    serviceWorkerReady = true
  })
}

async function createLazyProps(as, apiURL, shell) {
  if (typeof window === 'undefined') {
    if (apiURL.indexOf('?') === -1) {
      apiURL = apiURL + '?_includeAppData=1'
    } else {
      apiURL = apiURL + '&_includeAppData=1'
    }
  }

  const doFetch = (onlyHit = false) => {
    if (onlyHit && process.env.NODE_ENV === 'development') {
      return Promise.resolve({ status: 204 })
    }

    const headers = {
      'x-rsf-api-version': process.env.RSF_API_VERSION,
    }

    if (onlyHit) {
      headers['x-rsf-client-if'] = 'cache-hit'
    }

    return fetch(apiURL, {
      cache: 'force-cache',
      headers,
    })
  }

  if (typeof window === 'undefined') {
    // server
    if (shell) {
      return { lazy: apiURL }
    } else {
      return (await doFetch()).json()
    }
  } else {
    // client
    const { rsf } = window.history.state
    if (rsf && rsf[as]) {
      // going back or forward
      /* this is written useLazyStore's recordState function when the user navigates (not back) */
      return {
        pageData: rsf[as],
        requestId: nextRequestId() /* Need to send requestId or going back twice won't update the state correctly */,
      }
    } else if (serviceWorkerReady) {
      const res = await doFetch(true)

      if (res.status !== 204) {
        // response was found in the cache, return immediately
        return res.json()
      }
    }

    // normal client side navigation, fetch from network
    return {
      lazy: apiURL,
      // requestId forces useLazyProps to refetch from the server, which should be done every time
      // getInitialProps is called, otherwise pages that use replace state to add data to the query string
      // when state changes such as subcategory won't properly reset when the user clicks a link back
      // to the same page without the query string
      requestId: nextRequestId(),
    }
  }
}
