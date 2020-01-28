import PropTypes from 'prop-types'
import React from 'react'
import Image from '../Image'
import ReactImageMagnify from 'react-image-magnify'

/**
 * An element that determines the proper tag to use for a media node within a
 * [`Carousel`](/apiReference/carousel%f2Carousel).
 */
export default function Media({ magnifyProps, imageProps, src, alt, magnify, type = 'image' }) {
  if (type === 'video') {
    return <video src={src} alt={alt} />
  } else if (magnify) {
    return (
      <ReactImageMagnify
        enlargedImagePosition="over"
        {...magnifyProps}
        smallImage={{
          src: src,
          alt: alt,
          isFluidWidth: true,
        }}
        largeImage={magnify}
      />
    )
  } else {
    return <Image key={src} src={src} alt={alt} fill {...imageProps} />
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
   * Used as the `alt` tag for an `'image'` type.
   */
  alt: PropTypes.string,

  /**
   * Used as the `src` tag for an `'image'` type.
   */
  src: PropTypes.string,

  /**
   * If `true`, the media is able to be magnified and should use `ReactImageMagnify`.
   */
  magnify: PropTypes.bool,
}
