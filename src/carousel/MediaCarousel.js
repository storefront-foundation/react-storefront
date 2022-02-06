import PropTypes from 'prop-types'
import { styled, useTheme } from '@mui/material/styles'
import React, { useCallback, useEffect, useState, useRef } from 'react'
import clsx from 'clsx'
import useMediaQuery from '@mui/material/useMediaQuery'
import get from 'lodash/get'
import Carousel from './Carousel'
import Image from '../Image'
import Lightbox from './Lightbox'
import Media from './Media'
import MagnifyHint from './MagnifyHint'
import CarouselThumbnails from './CarouselThumbnails'

const PREFIX = 'RSFMediaCarousel'

const defaultClasses = {
  root: `${PREFIX}-root`,
  rootSideThumbs: `${PREFIX}-rootSideThumbs`,
  mediaWrap: `${PREFIX}-mediaWrap`,
  thumbnail: `${PREFIX}-thumbnail`,
  thumbnailsLeft: `${PREFIX}-thumbnailsLeft`,
  thumbnailsTop: `${PREFIX}-thumbnailsTop`,
  lightboxCarousel: `${PREFIX}-lightboxCarousel`,
  lightboxThumbs: `${PREFIX}-lightboxThumbs`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root component.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    flex: 1,
    [theme.breakpoints.up('sm')]: {
      overflow: 'hidden',
    },
  },

  /**
   * Styles applied to the root component when `thumbnailPosition` is `left` or `right`.
   */
  [`&.${defaultClasses.rootSideThumbs}`]: {
    [theme.breakpoints.up('sm')]: {
      flexDirection: 'row',
    },
  },

  /**
   * Styles applied to the wrapper element of each media component.
   */
  [`& .${defaultClasses.mediaWrap}`]: {
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'stretch',
    '& img': {
      maxHeight: '100%',
      maxWidth: '100%',
      objectFit: 'contain',
    },
  },

  /**
   * Styles applied to each of the thumbnail elements.
   */
  [`& .${defaultClasses.thumbnail}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
  },

  /**
   * Styles applied to the thumbnail component when thumbnailPosition is `left`.
   */
  [`& .${defaultClasses.thumbnailsLeft}`]: {
    [theme.breakpoints.up('sm')]: {
      order: -1,
    },
  },

  /**
   * Styles applied to the thumbnail component when thumbnailPosition is `top`.
   */
  [`& .${defaultClasses.thumbnailsTop}`]: {
    order: -1,
  },

  /**
   * Styles applied to the carousel component when the lightbox is shown.
   */
  [`& .${defaultClasses.lightboxCarousel}`]: {
    flex: 1,
    justifyContent: 'center',
    overflow: 'hidden',
  },

  /**
   * Styles applied to the thumbnails in the lightbox.
   */
  [`& .${defaultClasses.lightboxThumbs}`]: {
    paddingBottom: theme.spacing(2),
  },
}))

const THUMBNAIL_IMAGE_ID = '__rsf-placeholder-thumbnail'

export {}

/**
 * A carousel that displays images and videos for a product.  Specify
 * images and videos via the media prop, which should be of the form:
 *
 * ```js
 *  <MediaCarousel
 *    media={[
 *      { src: 'https://domain.com/path/to/image.jpg', alt: 'Red Shirt', type: 'image' },
 *      { src: 'https://domain.com/path/to/image.mpeg', alt: 'Demonstration', type: 'video' },
 *    ]}
 *    thumbnail={{
 *      src: 'https://domain.com/path/to/thumbnail.jpg', alt: 'thumbnail'
 *    }}
 *  />
 * ```
 *
 * To display a low-res thumbnail while high res images are loading, specify a `thumbnail` prop with `src` and `alt`
 *
 * Alternatively, you can provide a `product` prop as an object with `media` and `thumbnail` values that
 * adhere to the formats described above.
 *
 * ```js
 *  <MediaCarousel
 *      media={[
 *        { src: 'https://domain.com/path/to/image.jpg', alt: 'Red Shirt', type: 'image' },
 *        { src: 'https://domain.com/path/to/image.mpeg', alt: 'Demonstration', type: 'video' },
 *      ],
 *      thumbnail: {
 *        src: 'https://domain.com/path/to/thumbnail.jpg', alt: 'thumbnail'
 *      }
 *    }]}
 *  />
 * ```
 */
const MediaCarousel = function(props) {
  const {
    thumbnails,
    thumbnail,
    thumbsClassName,
    thumbnailPosition,
    magnifyHintClassName,
    videoProps,
    imageProps,
    lightboxProps,
    lightboxClassName,
    classes: c = {},
    media,
    magnifyProps,
    id,
    CarouselComponent,
    ImageComponent,
    MediaComponent,
    CarouselThumbnailsComponent,
    ...others
  } = props

  const classes = { ...defaultClasses, ...c }

  const [imagesLoaded, setImagesLoaded] = useState(false)

  const ref = useRef(null)
  const [over, setOver] = useState(false)
  const [selected, setSelected] = useState(0)
  const [video, setVideo] = useState(false)
  const [lightboxActive, setLightboxActive] = useState()
  const theme = useTheme()
  const isSmall = useMediaQuery(theme.breakpoints.down('sm'))
  const isThumbsSide = ['right', 'left'].includes(thumbnailPosition)

  useEffect(() => {
    // Reset selection index when media changes
    setSelected(0)
  }, [media])

  useEffect(() => {
    if (media && media.full && media.full[selected] && media.full[selected].type === 'video') {
      setVideo(true)
    } else {
      setVideo(false)
    }
  }, [selected])

  const timeout = useRef(null)

  const handleMouseEnter = useCallback(() => {
    timeout.current = window.setTimeout(() => {
      setOver(true)
      timeout.current = null
    }, 250)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setOver(false)

    if (timeout.current) {
      window.clearTimeout(timeout.current)
    }
  }, [])

  const onFullSizeImagesLoaded = useCallback(() => {
    setImagesLoaded(true)
  }, [])

  const onClickCarousel = useCallback(evt => {
    if (!evt.defaultPrevented && !video) {
      setLightboxActive(true)
    }
  })

  useEffect(() => {
    if (!ref.current || imagesLoaded || !thumbnail) return
    const firstImage = ref.current.querySelector('img')
    if (firstImage && firstImage.id !== THUMBNAIL_IMAGE_ID) {
      firstImage.addEventListener('load', onFullSizeImagesLoaded)
      return () => firstImage.removeEventListener('load', onFullSizeImagesLoaded)
    }
  }, [media, imagesLoaded, thumbnail])

  const belowAdornments = []

  if (thumbnail && !imagesLoaded) {
    belowAdornments.push(
      <ImageComponent
        id={THUMBNAIL_IMAGE_ID}
        key="thumbnail"
        className={classes.thumbnail}
        fill
        {...thumbnail}
      />,
    )
  }

  if (media && media.full && media.full.some(item => item.magnify)) {
    // we use the media's magnify.width prop to test if the image is larger than the screen size, and
    // hide the magnify hint if so. this is a magic large number just used to ensure that the hint is
    // shown if the width property is not defined for the given media
    const MAX_WIDTH = 10000
    let showHint = true
    if (lightboxActive) {
      const { innerWidth } = window
      const mediaWidth = get(media.full[selected], 'magnify.width', MAX_WIDTH)
      if (mediaWidth <= innerWidth) {
        showHint = false
      }
    }
    if (showHint && !video) {
      belowAdornments.push(
        <MagnifyHint
          key="magnify-hint"
          over={over}
          disableExpand={lightboxActive}
          className={magnifyHintClassName}
        />,
      )
    }
  }

  if (lightboxActive) {
    Object.assign(others, {
      autoplay: false,
      className: clsx(
        others.className,
        classes.lightboxCarousel,
        lightboxActive && lightboxClassName,
      ),
      height: isSmall ? '100%' : null,
      slideStyle: { ...(others.slideStyle || {}), display: 'flex', justifyContent: 'center' },
    })
  }

  const handleLightboxClose = useCallback(() => {
    setLightboxActive(false)
  }, [])

  const body = (
    <Root
      className={clsx(classes.root, {
        [classes.rootSideThumbs]: !lightboxActive && isThumbsSide,
      })}
    >
      <CarouselComponent
        id={id}
        ref={ref}
        belowAdornments={belowAdornments}
        classes={classes}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onClick={onClickCarousel}
        selected={selected}
        setSelected={setSelected}
        height="100%"
        // {...others}
      >
        {get(media, 'full', []).map((item, i) => {
          const magnifySrc = get(item, 'magnify.src', item.src)

          return (
            <MediaComponent
              key={i}
              magnifyProps={magnifyProps}
              {...item}
              src={lightboxActive ? magnifySrc : item.src}
              imageProps={
                lightboxActive
                  ? {
                      fill: false,
                      contain: true,
                      src: magnifySrc,
                    }
                  : imageProps
              }
              videoProps={videoProps}
            />
          )
        })}
      </CarouselComponent>
      {thumbnails && media && (
        <CarouselThumbnailsComponent
          className={clsx(
            thumbsClassName,
            lightboxActive && classes.lightboxThumbs,
            !lightboxActive && thumbnailPosition === 'left' && classes.thumbnailsLeft,
            !lightboxActive && thumbnailPosition === 'top' && classes.thumbnailsTop,
          )}
          bind={`${id}.index`}
          carouselId={id}
          selected={selected}
          setSelected={setSelected}
          thumbnails={media.thumbnails}
          thumbnailPosition={lightboxActive ? 'bottom' : thumbnailPosition}
        />
      )}
    </Root>
  )

  return (
    <Root>
      {body}
      <Lightbox {...lightboxProps} open={!!lightboxActive} onClose={handleLightboxClose}>
        {body}
      </Lightbox>
    </Root>
  )
}

MediaCarousel.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * If `true`, the carousel will have thumbnails below it.
   */
  thumbnails: PropTypes.bool,
  /**
   * Data for an image to be used for a thumbnail when the images are not yet loaded.
   */
  thumbnail: PropTypes.shape({
    src: PropTypes.string,
    alt: PropTypes.string,
  }),
  /**
   * An optional `className` to use for the thumbnails component.
   */
  thumbsClassName: PropTypes.string,
  /**
   * An optional `className` to use for the carousel component when the lightbox is open.
   */
  lightboxClassName: PropTypes.string,
  /**
   * Position of thumbnails, relative to the main carousel image. For small screens, the position
   * will revert to `top` when this value is set to `left` or `right`.
   *
   * This property will have no effect in Amp.
   */
  thumbnailPosition: PropTypes.oneOf(['bottom', 'top', 'left', 'right']),
  /**
   * A component type to use for the thumbnails.
   */
  CarouselThumbnailsComponent: PropTypes.elementType,

  /**
   * An optional `className` to use for the [`MagnifyHint`](/apiReference/carousel/MagnifyHint) component.
   */
  magnifyHintClassName: PropTypes.string,
  /**
   * Props passed through to each [`Media`](/apiReference/carousel/Media)'s video component.
   */
  videoProps: PropTypes.object,
  /**
   * Props passed through to each [`Media`](/apiReference/carousel/Media)'s
   * [`imageProps`](/apiReference/carousel/Media#prop-imageProps).
   */
  imageProps: PropTypes.object,
  /**
   * Data for all the media objects to show in the carousel.
   */
  media: PropTypes.shape({
    full: PropTypes.arrayOf(PropTypes.object),
    thumbnails: PropTypes.arrayOf(PropTypes.object),
  }),
  /**
   * Props passed through to each [`Media`](/apiReference/carousel/Media)'s
   * [`magnifyProps`](/apiReference/carousel/Media#prop-magnifyProps).
   */
  magnifyProps: PropTypes.object,
  /**
   * A component type to use for each media object in the carousel.
   */
  MediaComponent: PropTypes.elementType,

  /**
   * Props passed through to the [`Lightbox`](/apiReference/carousel/Lightbox).
   */
  lightboxProps: PropTypes.object,

  /**
   * An `id` attribute to use for the carousel's root element.
   */
  id: PropTypes.string,

  /**
   * A component type to use for the main carousel component.
   */
  CarouselComponent: PropTypes.elementType,

  /**
   * The component type to use to display images.
   */
  ImageComponent: PropTypes.elementType,
}

MediaCarousel.defaultProps = {
  lightboxProps: {},
  magnifyProps: {},
  thumbnails: true,
  thumbnailPosition: 'bottom',
  MediaComponent: Media,
  ImageComponent: Image,
  CarouselComponent: Carousel,
  CarouselThumbnailsComponent: CarouselThumbnails,
  videoProps: {
    controls: true,
    autoPlay: false,
  },
}

export default MediaCarousel
