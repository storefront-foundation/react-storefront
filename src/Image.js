import React, { useState, useRef, useEffect, useContext } from 'react'
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types'
import clsx from 'clsx'
import VisibilitySensor from 'react-visibility-sensor'
import PWAContext from './PWAContext'

const PREFIX = 'RSFImage';

const classes = {
  root: `${PREFIX}-root`,
  image: `${PREFIX}-image`,
  fit: `${PREFIX}-fit`,
  contain: `${PREFIX}-contain`,
  fill: `${PREFIX}-fill`
};

const StyledVisibilitySensor = styled(VisibilitySensor)((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${classes.root}`]: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Without a minimum height and width, the container will not fire
    // the visibility change
    minHeight: 1,
    minWidth: 1,
  },

  /**
   * Styles applied to the image element.
   */
  [`& .${classes.image}`]: {},

  /**
   * Styles applied to the image element when [`aspectRatio`](#prop-aspectRatio) is defined.
   */
  [`& .${classes.fit}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'block',
    width: '100%',
    height: '100%',
  },

  /**
   * Styles applied to the root element when [`contain`](#prop-contain) is `true`.
   */
  [`& .${classes.contain}`]: {
    '& img': {
      objectFit: 'contain',
      maxHeight: '100%',
      maxWidth: '100%',
    },
  },

  /**
   * Styles applied to the root element when [`fill`](#prop-fill) is `true`.
   */
  [`& .${classes.fill}`]: {
    width: '100%',
    height: '100%',
    '& img': {
      display: 'block',
      objectFit: 'contain',
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
      height: '100%',
    },
  }
}));

export {};

/**
 * Displays an image that can be lazy loaded and made to auto-scale to fit the parent element
 * by setting the `fill` prop, or grow/shrink while maintaining a given aspect ratio
 * by setting the `aspectRatio` prop.
 */
export default function Image({
  lazy,
  lazyOffset,
  notFoundSrc,
  height,
  width,
  fill,
  bind,
  contain,
  classes,
  className,
  aspectRatio,
  alt,
  src,
  amp,
  optimize,
  onChange,
  onSrcChange,
  onAltChange,
  value,
  ImgElement,
  ...imgAttributes
}) {
  function lazyLoad(visible) {
    if (!loaded && visible) {
      setLoaded(true)
    }
  }



  const { hydrating } = useContext(PWAContext) || {}
  const [loaded, setLoaded] = useState(lazy === false || (lazy === 'ssr' && !hydrating))
  const [primaryNotFound, setPrimaryNotFound] = useState(false)
  const ref = useRef()

  useEffect(() => {
    const img = ref.current
    if (img && img.complete && img.naturalWidth === 0) {
      setPrimaryNotFound(true)
    }
  }, [])

  if (src == null) return null

  contain = contain || aspectRatio

  if (primaryNotFound && notFoundSrc) {
    src = notFoundSrc
  }

  let result = (
    <div
      className={clsx(className, {
        [classes.root]: true,
        [classes.contain]: contain,
        [classes.fill]: fill,
      })}
    >
      {aspectRatio && <div style={{ paddingTop: `${aspectRatio * 100}%` }} />}
      {loaded && (
        <ImgElement
          ref={ref}
          src={src}
          key={src}
          height={height}
          width={width}
          alt={alt}
          className={clsx({
            [classes.image]: true,
            [classes.fit]: aspectRatio != null,
          })}
          {...imgAttributes}
          // prevent render "onerror" as a DOM prop in case of amp-img tag
          onError={
            ImgElement !== 'amp-img'
              ? () => setPrimaryNotFound(true)
              : /* istanbul ignore next */ undefined
          }
        />
      )}
    </div>
  )

  result = (
    <StyledVisibilitySensor
      active={!loaded}
      onChange={lazyLoad}
      partialVisibility
      offset={{ top: -lazyOffset, bottom: -lazyOffset }}
    >
      {result}
    </StyledVisibilitySensor>
  )

  return result
}

Image.propTypes = {
  /**
   * The URL for the image.
   */
  src: PropTypes.string,

  /**
   * The URL of the image to use in case the primary image fails to load.
   */
  notFoundSrc: PropTypes.string,

  /**
   * The ratio of height/width as a float.  For example: `1` when the height and width match,
   * `0.5` when height is half of the width.
   */
  aspectRatio: PropTypes.number,

  /**
   * Set to `true` to apply object-fit:contain to the image so that it automatically
   * fits within the element's height and width.
   */
  contain: PropTypes.bool,

  /**
   * The same as `contain`, except images are stretched to fill the element's height and width.
   */
  fill: PropTypes.bool,

  /**
   * Set to `true` to wait until the image enters the viewport before loading it. Set to `"ssr"` to
   * only lazy load images during server side rendering.
   */
  lazy: PropTypes.oneOf(['ssr', true, false]),

  /**
   * Sets the minimum amount of pixels the image can be scrolled out of view before it
   * is lazy loaded.  You must set `lazy` in order for this setting to take effect.
   */
  lazyOffset: PropTypes.number,
}

Image.defaultProps = {
  contain: false,
  fill: false,
  lazy: false,
  lazyOffset: 100,
  ImgElement: 'img',
}
