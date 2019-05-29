/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, createRef } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react'
import classnames from 'classnames'
import VisibilitySensor from 'react-visibility-sensor'

export const styles = theme => ({
  root: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    // Without a minimum height, the container will not fire
    // the visibility change
    minHeight: 1
  },
  fit: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'block',
    width: '100%',
    height: '100%'
  },
  contain: {
    '& img': {
      objectFit: 'contain',
      maxHeight: '100%',
      maxWidth: '100%'
    }
  },
  fill: {
    '& img': {
      display: 'block',
      objectFit: 'contain',
      maxHeight: '100%',
      maxWidth: '100%',
      width: '100%',
      height: '100%'
    }
  }
})

/**
 * Provide amp-compatible mobile-optimized images that can be made to auto-scale to fit the parent element
 * by setting the `fill` prop, or grow/shrink while maintaining a given aspect ratio
 * by setting the `aspectRatio` prop.
 */
@withStyles(styles, { name: 'RSFImage' })
@inject(({ app }) => ({ amp: app.amp }))
export default class Image extends Component {
  static propTypes = {
    /**
     * The URL for the image
     */
    src: PropTypes.string,

    /**
     * The URL of the image to use in case the primary image fails to load
     */
    notFoundSrc: PropTypes.string,

    /**
     * The ratio of height/width as a float.  For example: 1 when the height and width match,
     * 0.5 when height is half of the width.
     */
    aspectRatio: PropTypes.number,

    /**
     * The quality of image to retreive from 0 to 100
     */
    quality: PropTypes.number,

    /**
     * Set to true to apply object-fit:contain to the image so that it automatically
     * fits within the element's height and width.
     */
    contain: PropTypes.bool,

    /**
     * The same as contain, except images are stretched to fill the element's height and width.
     */
    fill: PropTypes.bool,

    /**
     * Set to true to wait until the image enters the viewport before loading it.
     */
    lazy: PropTypes.bool,

    /**
     * Sets the minimum amount of pixels the image can be scrolled out of view before it
     * is lazy loaded.  Defaults to 100.  You must set `lazy` in order for this setting to take effect.
     */
    lazyOffset: PropTypes.number
  }

  static defaultProps = {
    quality: null,
    contain: false,
    fill: false,
    lazy: false,
    lazyOffset: 100
  }

  constructor({ lazy, amp }) {
    super()

    this.state = {
      loaded: !lazy || amp,
      primaryNotFound: false
    }

    this.ref = createRef()
  }

  componentDidMount() {
    const img = this.ref.current

    if (img && img.complete && img.naturalWidth === 0) {
      this.handleNotFound()
    }
  }

  render() {
    let {
      lazy,
      lazyOffset,
      notFoundSrc,
      height,
      width,
      quality,
      amp,
      fill,
      contain,
      classes,
      className,
      aspectRatio,
      alt,
      src,
      ...imgAttributes
    } = this.props
    const { loaded, primaryNotFound } = this.state

    contain = contain || aspectRatio

    // Overiding `src` prop if `quality` was set
    src = this.getOptimizedSrc()

    if (primaryNotFound) {
      src = notFoundSrc
    }

    const assignedAttributes = {
      src,
      key: src,
      [amp ? 'class' : 'className']: classnames({
        [classes.fit]: aspectRatio != null
      }),
      layout: amp ? this.ampLayout() : null,
      height,
      width,
      alt
    }

    let result = (
      <div
        className={classnames(className, {
          [classes.root]: true,
          [classes.contain]: contain,
          [classes.fill]: fill
        })}
      >
        {aspectRatio && <div style={{ paddingTop: `${aspectRatio}%` }} />}
        {amp ? (
          <amp-img {...assignedAttributes} />
        ) : (
          loaded && (
            <img
              ref={this.ref}
              {...assignedAttributes}
              {...imgAttributes}
              onError={this.handleNotFound}
            />
          )
        )}
      </div>
    )

    if (!amp && lazy) {
      result = (
        <VisibilitySensor
          active={!loaded}
          onChange={this.lazyLoad}
          partialVisibility
          offset={{ top: -lazyOffset, bottom: -lazyOffset }}
        >
          {result}
        </VisibilitySensor>
      )
    }

    return result
  }

  ampLayout() {
    const { fill, contain, aspectRatio } = this.props

    if (contain || fill || aspectRatio) {
      return 'fill'
    } else {
      return 'intrinsic'
    }
  }

  handleNotFound = () => {
    this.setState({ primaryNotFound: true })
  }

  lazyLoad = visible => {
    if (!this.state.loaded && visible) {
      this.setState({ loaded: true })
    }
  }

  getOptimizedSrc() {
    const { src, quality } = this.props

    if (quality) {
      return `https://opt.moovweb.net/?quality=${encodeURIComponent(
        quality
      )}&img=${encodeURIComponent(src)}`
    } else {
      return src
    }
  }
}
