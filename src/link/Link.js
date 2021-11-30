import React, { useContext, useRef, useEffect } from 'react'
import NextLink from 'next/link'
import LinkContext from './LinkContext'
import PropTypes from 'prop-types'
import { RootRef } from '@mui/material'
import useIntersectionObserver from '../hooks/useIntersectionObserver'
import { prefetch as doPrefetch } from '../serviceWorker'
import withDefaultHandler from '../utils/withDefaultHandler'
import getAPIURL from '../api/getAPIURL'

/**
 * Use this component for all Links in your React Storefront app.  You can
 * pass props to display on the next page while data is loading from the server
 * using the `pageData` prop. This component accepts all props that would
 * normally be passed to a [Next.js `Link` component](https://nextjs.org/docs/api-reference/next/link).
 * All other props are spread to the underlying HTML anchor element.
 *
 * Example:
 *
 * ```js
 * import Link from 'react-storefront/link/Link'
 *
 * <Link href="/p/[productId]" as={`/p/${product.id}`} pageData={{ product }}>
 *   {product.name}
 * </Link>
 * ```
 */
const Link = ({ as, href, prefetch, prefetchURL, pageData, onClick, children, ...other }) => {
  const ref = useRef(null)
  const linkPageData = useContext(LinkContext)

  const handleClick = withDefaultHandler(onClick, () => {
    if (linkPageData) {
      linkPageData.current = pageData
    }
  })

  prefetchURL = prefetchURL || (as && getAPIURL(as))

  useIntersectionObserver(
    () => (prefetchURL && prefetch === 'visible' ? ref : null),
    (visible, disconnect) => {
      if (visible && prefetchURL) {
        disconnect()
        doPrefetch(prefetchURL)
      }
    },
    [prefetchURL, prefetch],
  )

  useEffect(() => {
    if (prefetch === 'always' && prefetchURL) {
      doPrefetch(prefetchURL)
    }
  }, [prefetchURL])

  if (!children || typeof children === 'string') {
    return (
      <NextLink href={href} prefetch={false} as={as} passHref>
        <a ref={ref} {...other} onClick={handleClick}>
          {children}
        </a>
      </NextLink>
    )
  } else {
    const child = React.Children.only(children)
    const passHref = !child.props.href // we only passHref if the child does not have an href prop already.  This fixes a bug with AMP where NextLink overrides and escapes amp-bind syntax in hrefs.

    // This way we can get a ref of Material-ui components
    return (
      <RootRef rootRef={ref}>
        <NextLink href={href} prefetch={false} as={as} passHref={passHref}>
          {React.cloneElement(children, {
            onClick: handleClick,
            ...other,
          })}
        </NextLink>
      </RootRef>
    )
  }
}

Link.propTypes = {
  /**
   * The URL path for the underlying anchor element's `href`.  This is required for dynamic routes.
   */
  as: PropTypes.string,

  /**
   * The next.js route pattern
   */
  href: PropTypes.string.isRequired,

  /**
   * Set to `visible` to prefetch the JSON data for the destination page component when the link
   * is scrolled into the viewport.  Set to `always` to prefetch the data immediately. Set to
   * `false` to never prefetch.
   */
  prefetch: PropTypes.oneOf(['always', 'visible', false]),

  /**
   * The URL to prefetch.  If omitted, `/api/{href}` will be prefetched.
   */
  prefetchURL: PropTypes.string,

  /**
   * Data to be added to the `pageData` key returned by [`/hooks/useLazyState`](/apiReference/hooks/useLazyState)
   * in the destination page component.  Use this to display partial data in the skeleton while the full dataset
   * is fetched from the server.
   */
  pageData: PropTypes.object,

  /**
   * An optional function to run when the Link is clicked.
   */
  onClick: PropTypes.func,

  /**
   * Content children of the link element.
   */
  children: PropTypes.node,
}

export default Link
