import React, { useEffect, useRef } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import doLazyLoadImages from './utils/lazyLoadImages'
import { prefetchJsonFor } from './serviceWorker'

const PREFIX = 'RSFCmsSlot'

const classes = {
  inline: `${PREFIX}-inline`,
  block: `${PREFIX}-block`,
  root: `${PREFIX}-root`,
}

const Root = styled('span')(() => ({
  [`& .${classes.inline}`]: {
    display: 'inline',
  },

  [`& .${classes.block}`]: {
    display: 'block',
  },

  [`& .${classes.root}`]: {
    '& .rsf-presized-img': {
      position: 'relative',

      '& img': {
        position: 'absolute',
        height: '100%',
        width: '100%',
        top: 0,
        left: 0,
      },
    },
    '& img[data-src]': {
      visibility: 'hidden',
    },
  },
}))

export { classes }

/**
 * A container for HTML blob content from a CMS.  Content is dangerously inserted into the DOM.
 * Pass the html as a string as the child of this component. Additional props are spread to the
 * rendered span element.
 */
const CmsSlot = ({ children, className, inline, lazyLoadImages, prefetchLinks, ...others }) => {
  const el = useRef()

  useEffect(() => {
    try {
      if (!el.current) return

      if (lazyLoadImages) {
        doLazyLoadImages(el.current)
      }

      if (prefetchLinks) {
        const links = Array.from(el.current.querySelectorAll('a[data-rsf-prefetch="always"]'))

        for (const link of links) {
          prefetchJsonFor(link.getAttribute('href'))
        }
      }
    } catch (e) {
      console.warn('error running side effects on CmsSlot', e)
    }
  }, [children])

  return children ? (
    <Root
      {...others}
      ref={el}
      className={clsx(className, classes.root, {
        [classes.inline]: inline,
        [classes.block]: !inline,
      })}
      dangerouslySetInnerHTML={{ __html: children }}
    />
  ) : null
}
CmsSlot.propTypes = {
  /**
   * If `true`, will use `display: inline` style.
   */
  inline: PropTypes.bool,

  /**
   * If `true` to lazy load images that have been preprocessed with `$.lazyLoadImages()`.
   */
  lazyLoadImages: PropTypes.bool,

  /**
   * If `true`, prefetch links that have a `data-rsf-prefetch` attribute.
   */
  prefetchLinks: PropTypes.bool,
  className: PropTypes.string,
}

CmsSlot.defaultProps = {
  lazyLoadImages: false,
}

export default CmsSlot
