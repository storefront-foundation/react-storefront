import PropTypes from 'prop-types'
import React from 'react'
import Image from '../Image'
import ReactImageMagnify from 'react-image-magnify'
import qs from 'qs'

function getOptimizedSrc(url, options) {
  return `https://opt.moovweb.net/?${qs.stringify({ ...options, img: url })}`
}

/**
 * An element that determines the proper tag to use for a media node within a
 * [`Carousel`](/apiReference/carousel%f2Carousel).
 */
export default function Media({
  magnifyProps,
  imageProps,
  src,
  alt,
  magnify,
  type = 'image',
  ImageComponent,
}) {
  if (type === 'video') {
    return <video src={src} alt={alt} />
  } else if (magnify) {
    return (
      <ReactImageMagnify
        enlargedImagePosition="over"
        {...magnifyProps}
        smallImage={{
          src: getOptimizedSrc(src, imageProps.optimize),
          alt: alt,
          isFluidWidth: true,
        }}
        largeImage={magnify}
      />
    )
  } else {
    return <ImageComponent key={src} src={src} alt={alt} fill {...imageProps} />
  }
}

Media.propTypes = {
  /**
   * The type of media to display.
   */
  type: PropTypes.oneOf(['image', 'video']),

  /**
   * Props passed to the [`ReactImageMagnify`](https://github.com/ethanselzer/react-image-magnify#usage)
   * element for an `'image'` type when [`magnify`](#prop-magnify) is `true`.
   */
  magnifyProps: PropTypes.object,

  /**
   * Other props to pass to the [`Image`](/apiReference/Image) for an `'image'` type.
   */
  imageProps: PropTypes.object,

  /**
   * The component type to use to display images.
   */
  ImageComponent: PropTypes.elementType,

  /**
   * Used as the `alt` tag for an `'image'` type.
   */
  alt: PropTypes.string,

  /**
   * Used as the `src` tag for an `'image'` type.
   */
  src: PropTypes.string,

  /**
   * An object to pass to pass to `ReactImageMagnify` containing the data for the magnified image.
   * If `false`, the media is not able to be magnified.
   */
  magnify: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}

Media.defaultProps = {
  imageProps: {},
  ImageComponent: Image,
}
