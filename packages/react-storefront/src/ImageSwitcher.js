/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import SwipeableViews from 'react-swipeable-views'
import withStyles from '@material-ui/core/styles/withStyles'
import ChevronLeft from '@material-ui/icons/ChevronLeft'
import ChevronRight from '@material-ui/icons/ChevronRight'
import IconButton from '@material-ui/core/IconButton'
import Portal from '@material-ui/core/Portal'
import { fade } from '@material-ui/core/styles/colorManipulator'
import classnames from 'classnames'
import { ReactPinchZoomPan } from 'react-pinch-zoom-pan'
import TabsRow from './TabsRow'
import analytics from './analytics'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import AmpImageSwitcher from './amp/AmpImageSwitcher'
import LoadMask from './LoadMask'
import Image from './Image'
import Video from './Video'

const paletteIconTextColor = '#77726D'

const mediaPropType = PropTypes.shape({
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  video: PropTypes.bool
})

export const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',

    '& img': {
      display: 'block'
    }
  },

  swipeWrap: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    '& .react-swipeable-view-container, & > div:first-child': {
      height: '100%'
    }
  },

  imageWrap: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    '& img': {
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'contain'
    }
  },

  thumbsTitle: {
    textTransform: 'uppercase'
  },

  productThumb: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  },

  thumbs: {
    marginTop: `${theme.margins.container}px`
  },

  thumbnail: {
    paddingBottom: '8px',
    margin: '0 2px',
    boxSizing: 'content-box',
    height: '50px',
    width: '50px'
  },

  activeThumbs: {
    position: 'absolute',
    width: '100%',
    bottom: '20px'
  },

  selected: {
    borderColor: '#D0D0D0'
  },

  arrows: {
    [theme.breakpoints.down('xs')]: {
      display: 'none'
    }
  },

  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: '-24px'
  },

  leftArrow: {
    left: 0
  },

  rightArrow: {
    right: 0
  },

  icon: {
    height: '30px',
    width: '30px'
  },

  dot: {
    backgroundColor: fade(theme.palette.text.primary, 0.25),
    width: 8,
    height: 8,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    // Same duration as SwipeableViews animation
    transitionDuration: '0.35s'
  },

  dotSelected: {
    backgroundColor: theme.palette.text.primary
  },

  dots: {
    position: 'absolute',
    bottom: '5px',
    textAlign: 'center',
    width: '100%'
  },

  viewerToggle: {
    transform: 'scale(0.4)',
    position: 'absolute',
    top: 0,
    right: 0,
    background: fade(theme.palette.text.icon || paletteIconTextColor, 0.4),
    borderRadius: '50%',
    width: '100px',
    height: '100px',
    transitionDuration: '0.5s',
    '-webkit-tap-highlight-color': 'rgba(0, 0, 0, 0)'
  },

  viewerActive: {
    transform: 'scale(0.4) rotateZ(45deg)'
  },

  viewerOverlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    background: theme.palette.background.paper,
    zIndex: 9999,
    transitionDuration: '0.5s',
    transform: 'translateY(100%)',
    visibility: 'hidden', // prevents lightbox from showing near the bottom of screen when browser controls hide on ios
    '& img': {
      margin: 'auto',
      maxHeight: '100%',
      maxWidth: '100%'
    },
    // Hack to fix root div height of pan/zoom/pinch container
    '& > div:first-child': {
      height: '100%'
    }
  },

  viewerOverlayActive: {
    transform: 'translateY(0%)',
    visibility: 'visible'
  },

  tabsRowRoot: {
    boxShadow: 'none'
  },

  tabScroller: {
    [theme.breakpoints.down('xs')]: {
      padding: `0 ${theme.margins.container}px`
    }
  },

  indicator: {
    display: 'none'
  },

  mask: {
    opacity: '0.8'
  },

  playButton: {
    '&:after': {
      color: 'white',
      content: '"►"',
      position: 'absolute',
      left: 'calc(50% - 24px)',
      top: 'calc(50% - 24px)',
      fontSize: '48px'
    }
  },

  playing: {
    '&:after': {
      display: 'none'
    }
  }
})

/**
 * A swipeable image selector suitable for PDPs
 */
@withStyles(styles, { name: 'RSFImageSwitcher' })
@inject('app')
@observer
export default class ImageSwitcher extends Component {
  static propTypes = {
    /**
     * If specified, then the image_switched analytics event will be
     * fired when an image is selected and the product's images and thumbnails will
     * automatically be displayed.
     */
    product: PropTypes.object,

    /**
     * An array of (URL or image object) for the full size images
     */
    images: PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, mediaPropType])).isRequired,

    /**
     * An array of thumbnails to display below the main image.  You can also
     * specify `false` to hide the thumbnails entirely.
     */
    thumbnails: PropTypes.oneOfType([
      PropTypes.bool,
      PropTypes.arrayOf(PropTypes.oneOfType([PropTypes.string, mediaPropType]))
    ]),

    /**
     * Display left/right arrows for navigating through images
     */
    arrows: PropTypes.bool,

    /**
     * Display indicator dots at the bottom of the component
     */
    indicators: PropTypes.bool,

    /**
     * Optional title for thumbnails block
     */
    thumbnailsTitle: PropTypes.string,

    /*
     * Option to show thumbnails only when zoomed view is active
     */
    viewerThumbnailsOnly: PropTypes.bool,

    /**
     * Props to apply to the Image component used to display the product thumbnail while
     * the product data is loading
     */
    loadingThumbnailProps: PropTypes.object,

    /**
     * Props to be added to the Image child components.
     */
    imageProps: PropTypes.object,

    /*
     * Option to manually set the selected index
     */
    selectedIndex: PropTypes.number,

    /**
     * The URL of image to load if an image fails to load
     */
    notFoundSrc: PropTypes.string,

    /**
     * Config options for the image viewer
     */
    reactPinchZoomPanOptions: PropTypes.shape({
      onPinchStart: PropTypes.func,
      onPinchStop: PropTypes.func,
      initialScale: PropTypes.number,
      maxScale: PropTypes.number
    }),

    /**
     * Set to true to always revert back to the first image when image URLs
     * are changed.  This behavior is automatically adopted when the `product`
     * prop is specified.
     */
    resetSelectionWhenImagesChange: PropTypes.bool
  }

  static defaultProps = {
    images: [],
    thumbnails: [],
    viewerThumbnailsOnly: false,
    arrows: true,
    indicators: false,
    loadingThumbnailProps: {},
    imageProps: {},
    reactPinchZoomPanOptions: {
      maxScale: 3
    }
  }

  state = {
    selectedIndex: 0,
    productId: null,
    viewerActive: false,
    fullSizeImagesLoaded: false,
    playingVideo: false
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    const { product } = nextProps
    const { productId } = prevState

    if (
      typeof nextProps.selectedIndex === 'number' &&
      nextProps.selectedIndex !== prevState.selectedIndex
    ) {
      // update the selectedIndex state if a new prop value is passed in
      return { selectedIndex: nextProps.selectedIndex }
    } else if (product && product.id !== productId) {
      // reset the selectedIndex state if the product changes
      return { productId: product.id, selectedIndex: 0 }
    } else {
      return null
    }
  }

  componentDidMount() {
    if (this.props.resetSelectionWhenImagesChange || this.props.product) {
      this.disposeReaction = reaction(
        () => this.images,
        () => {
          this.setState({ selectedIndex: 0, fullSizeImagesLoaded: false })
        }
      )
    }
  }

  componentWillUnmount() {
    if (this.disposeReaction) {
      this.disposeReaction()
    }
  }

  renderViewerToggle() {
    return (
      <div
        onClick={() => this.toggleViewer()}
        className={classnames(this.props.classes.viewerToggle, {
          [this.props.classes.viewerActive]: this.state.viewerActive
        })}
      >
        <svg width="100" height="100" viewBox="0 0 100 100">
          <line x1="50" y1="25" x2="50" y2="75" strokeWidth="4" stroke="white" />
          <line x1="25" y1="50" x2="75" y2="50" strokeWidth="4" stroke="white" />
        </svg>
      </div>
    )
  }

  toggleViewer() {
    if (this.state.viewerActive) {
      document.body.classList.remove('moov-modal')
    } else {
      document.body.classList.add('moov-modal')
    }

    this.setState({ viewerActive: !this.state.viewerActive })
  }

  renderDot(index) {
    const classes = classnames(this.props.classes.dot, {
      [this.props.classes.dotSelected]: index === this.state.selectedIndex
    })
    return <div key={index} className={classes} />
  }

  get thumbnails() {
    const { thumbnails, product } = this.props
    if (thumbnails === false) return []
    const _thumbnails =
      thumbnails && thumbnails.length ? thumbnails : (product && product.thumbnails) || []
    return _thumbnails.map(e => {
      return typeof e === 'string' ? { src: e, alt: 'thumbnail' } : e
    })
  }

  get images() {
    const { images, product } = this.props
    const _images = images && images.length ? images : (product && product.images) || []
    return _images.map(e => {
      return typeof e === 'string' ? { src: e, alt: 'product', video: false } : e
    })
  }

  renderThumbnails() {
    const { classes, thumbnailsTitle, notFoundSrc } = this.props
    const { thumbnails } = this
    const modifiedThumbs = thumbnails && thumbnails.map(({ src, alt }) => ({ imageUrl: src, alt }))
    const { viewerActive, selectedIndex } = this.state

    return (
      thumbnails &&
      thumbnails.length > 0 && (
        <div className={classnames(classes.thumbs, { [classes.activeThumbs]: viewerActive })}>
          <div className="field">
            <label className={classes.thumbsTitle}>{thumbnailsTitle}</label>
          </div>
          <TabsRow
            classes={{
              scroller: classes.tabScroller,
              root: classes.tabsRowRoot
            }}
            imageProps={{
              className: classes.thumbnail,
              notFoundSrc,
              fill: true
            }}
            centered
            initialSelectedIdx={selectedIndex}
            onTabChange={(e, selectedIndex) =>
              this.setState({ selectedIndex, playingVideo: false })
            }
            items={modifiedThumbs}
          />
        </div>
      )
    )
  }

  componentDidUpdate(prevProps, prevState) {
    if (
      prevState &&
      prevState.selectedIndex &&
      prevState.selectedIndex !== this.state.selectedIndex &&
      this.props.product
    ) {
      analytics.fire('imageSwitched', {
        product: this.props.product,
        imageUrl: this.props.images[this.state.selectedIndex]
      })
    }
  }

  render() {
    let {
      app,
      product,
      classes,
      className,
      arrows,
      indicators,
      style,
      reactPinchZoomPanOptions,
      loadingThumbnailProps,
      imageProps,
      viewerThumbnailsOnly,
      notFoundSrc
    } = this.props
    const { images, thumbnails } = this
    const { fullSizeImagesLoaded } = this.state

    if (app.amp)
      return (
        <AmpImageSwitcher
          product={product}
          images={images}
          thumbnails={thumbnails}
          className={className}
          classes={{
            root: classes.root,
            dot: classes.dot,
            dots: classes.dots,
            dotSelected: classes.dotSelected,
            thumbnails: classes.thumbs
          }}
          arrows={arrows}
          indicators={indicators}
          thumbnails={viewerThumbnailsOnly ? null : this.thumbnails}
        />
      )

    const { selectedIndex, viewerActive } = this.state
    const selectedImage = images[selectedIndex]
    const SelectedImageTag = selectedImage.video ? 'video' : 'img'

    return (
      <div className={classnames(className, classes.root)} style={style}>
        {/* Full Size Images */}
        <div className={classes.swipeWrap}>
          <SwipeableViews
            index={selectedIndex}
            onChangeIndex={i => this.setState({ selectedIndex: i })}
          >
            {images.map(({ src, alt, video }, i) => (
              <div key={i} className={classes.imageWrap}>
                {video ? (
                  <Video src={src} alt={alt || 'product'} />
                ) : (
                  <Image
                    key={src}
                    notFoundSrc={notFoundSrc}
                    src={i === 0 && app.loading ? null : src} // need to clear src when app.loading is true so that the onLoad event will fire and the loading thumbnail will be removed
                    alt={alt || 'product'}
                    onLoad={i === 0 ? this.onFullSizeImagesLoaded : null}
                    {...imageProps}
                  />
                )}
              </div>
            ))}
          </SwipeableViews>

          {arrows && (
            <div className={classes.arrows}>
              {selectedIndex !== 0 && (
                <IconButton
                  className={classnames(classes.arrow, classes.leftArrow)}
                  onClick={() => this.setState({ selectedIndex: selectedIndex - 1 })}
                >
                  <ChevronLeft classes={{ root: classes.icon }} />
                </IconButton>
              )}
              {selectedIndex !== images.length - 1 && (
                <IconButton
                  className={classnames(classes.arrow, classes.rightArrow)}
                  onClick={() => this.setState({ selectedIndex: selectedIndex + 1 })}
                >
                  <ChevronRight classes={{ root: classes.icon }} />
                </IconButton>
              )}
            </div>
          )}

          {indicators && (
            <div className={classes.dots}>{images.map((_, index) => this.renderDot(index))}</div>
          )}

          {product && <LoadMask show={product.loadingImages} className={classes.mask} />}

          {product &&
            app.loadingProduct &&
            app.loadingProduct.thumbnail &&
            !fullSizeImagesLoaded && (
              <Image
                src={app.loadingProduct.thumbnail}
                className={classes.productThumb}
                {...loadingThumbnailProps}
                fill
              />
            )}

          <Portal>
            <div
              className={classnames(classes.viewerOverlay, {
                [classes.viewerOverlayActive]: viewerActive
              })}
            >
              <ReactPinchZoomPan
                {...reactPinchZoomPanOptions}
                render={obj => {
                  return (
                    <div
                      style={{
                        overflow: 'hidden',
                        position: 'relative',
                        height: '100%'
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          height: '100%'
                        }}
                        className={classnames({
                          [classes.playButton]: selectedImage.video,
                          [classes.playing]: this.state.playingVideo
                        })}
                        onClick={() => {
                          if (this.selectedVideo) {
                            if (this.selectedVideo.paused) {
                              this.selectedVideo.play()
                              this.setState({ playingVideo: true })
                            } else {
                              this.selectedVideo.pause()
                              this.setState({ playingVideo: false })
                            }
                          }
                        }}
                      >
                        {selectedImage && (
                          <SelectedImageTag
                            ref={el => {
                              if (selectedImage.video) {
                                this.selectedVideo = el
                              }
                            }}
                            src={selectedImage.src}
                            alt={selectedImage.alt}
                            style={{
                              width: '100%',
                              height: 'auto',
                              transform: `scale(${obj.scale}) translateY(${obj.y}px) translateX(${
                                obj.x
                              }px)`
                            }}
                          />
                        )}
                      </div>
                    </div>
                  )
                }}
              />
              {viewerActive && this.renderViewerToggle()}
              {viewerActive && this.renderThumbnails()}
            </div>
          </Portal>
          {!viewerActive && this.renderViewerToggle()}
        </div>

        {!viewerActive && !viewerThumbnailsOnly && this.renderThumbnails()}
      </div>
    )
  }

  onFullSizeImagesLoaded = () => {
    this.setState({ fullSizeImagesLoaded: true })
    this.props.app.applyState({ loadingProduct: null })
  }
}
