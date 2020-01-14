import React, { useCallback, useRef, useContext, useEffect } from 'react'
import PWAContext from './PWAContext'

/**
 * Wrap product links in this component to reuse the thumbnail as the main image in the product
 * skeleton when transitioning to the PDP to make the transition feel instance. This component
 * sets the `thumbnail` ref on the provided `PWAContext` to the `src` prop of the first `img`
 * element found amongst the descendant elements in the tree.
 *
 * Example:
 *
 * ```js
 *  <ForwardThumbnail>
 *    <Link href="/p/[productId]" as={product.url}>
 *      <a>
 *        <Image src={product.media.thumbnail.src} alt={product.media.thumbnail.alt} />
 *        <div>{product.name}</div>
 *      </a>
 *    </Link>
 *  </ForwardThumbnail>
 * ```
 */
export default function ForwardThumbnail({ children }) {
  const ref = useRef(null)
  const context = useContext(PWAContext)
  const srcRef = useRef(null)

  useEffect(() => {
    srcRef.current = ref.current.querySelector('img').getAttribute('src')
  }, [children])

  const handleClick = useCallback(() => {
    context.thumbnail.current = { src: srcRef.current }
  }, [])

  return (
    <div ref={ref} onClick={handleClick}>
      {children}
    </div>
  )
}
