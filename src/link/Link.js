import React, { useContext, useRef, forwardRef } from 'react'
import NextLink from 'next/link'
import LinkContext from './LinkContext'
import PropTypes from 'prop-types'
import { RootRef } from '@material-ui/core'
import withDefaultHandler from '../utils/withDefaultHandler'

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
const Link = forwardRef(({ as, href, pageData, onClick, children, ...other }, ref) => {
  const linkPageData = useContext(LinkContext)

  const handleClick = withDefaultHandler(onClick, () => {
    if (linkPageData) {
      linkPageData.current = pageData
    }
  })

  const child =
    !children || typeof children === 'string' ? (
      <a {...other} onClick={handleClick}>
        {children}
      </a>
    ) : (
      React.cloneElement(children, { onClick: handleClick, ...other })
    )

  const nextLink = (
    <NextLink href={href} as={as} passHref>
      {child}
    </NextLink>
  )

  if (ref) {
    return <RootRef rootRef={ref}>{nextLink}</RootRef>
  } else {
    return nextLink
  }
})

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
