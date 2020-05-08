import PropTypes from 'prop-types'
import React from 'react'
import Image from '../Image'
import ReactImageMagnify from 'react-image-magnify'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'

const useStyles = makeStyles(theme => ({
  rimRoot: {
    height: '100% !important',
    width: '100% !important',
  },
  rimSmallImage: {
    height: '100% !important',
    width: '100% !important',
  },
}))

/**
 * An element that determines the proper tag to use for a media node within a
 * [`Carousel`](/apiReference/carousel/Carousel).
 */
export default function Media({
  magnifyProps,
  imageProps,
  videoProps,
  src,
  alt,
  magnify,
  sources,
  poster,
  type = 'image',
}) {
  const classes = useStyles()

  const adjustMagnifyProps = () => {
    const appliedMagnifyProps = { ...(magnifyProps || {}) }
    appliedMagnifyProps.style = {
      ...((magnifyProps && magnifyProps.style) || {}),
      display: 'flex',
      objectFit: 'contain',
    }
    appliedMagnifyProps.imageStyle = {
      ...((magnifyProps && magnifyProps.imageStyle) || {}),
      objectFit: 'contain',
    }
    appliedMagnifyProps.className = clsx(magnifyProps && magnifyProps.className, classes.rimRoot)
    appliedMagnifyProps.imageClassName = clsx(
      magnifyProps && magnifyProps.imageClassName,
      classes.rimSmallImage,
    )
    appliedMagnifyProps.enlargedImageStyle = {
      ...((magnifyProps && magnifyProps.enlargedImageStyle) || {}),
      height: '100%',
    }
    return appliedMagnifyProps
  }

  if (type === 'video') {
    if (sources && sources.length) {
      return (
        <video alt={alt} {...videoProps}>
          {sources.map(source => (
            <source key={source.src} src={source.src} type={source.type} />
          ))}
        </video>
      )
    } else {
      return <video src={src} alt={alt} {...videoProps} />
    }
  } else if (magnify) {
    return (
      <ReactImageMagnify
        enlargedImagePosition="over"
        {...adjustMagnifyProps()}
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
   * element for an `'image'` type when [`magnify`](#prop-magnify) is defined.
   */
  magnifyProps: PropTypes.object,

  /**
   * Other props to pass to the video component.
   */
  videoProps: PropTypes.object,

  /**
   * Other props to pass to the [`Image`](/apiReference/Image) for an `'image'` type.
   */
  imageProps: PropTypes.object,

  /**
   * Used as the `alt` attribute for the `<img>` or `<video>`.
   */
  alt: PropTypes.string,

  /**
   * Used as the `src` attribute for the `<img>` or `<video>`.
   */
  src: PropTypes.string,

  /**
   * Used as the source inside the video `<video>`.
   */
  sources: PropTypes.array,

  /**
   * An object to pass to pass to `ReactImageMagnify` containing the data for the magnified image.
   * If `false`, the media is not able to be magnified.
   */
  magnify: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
}
