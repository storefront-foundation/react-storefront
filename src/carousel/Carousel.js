import React, { Fragment, useCallback, useState } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay, virtualize } from 'react-swipeable-views-utils'
import PropTypes from 'prop-types'
import CarouselDots from './CarouselDots'
import CarouselArrows from './CarouselArrows'
import mod from '../utils/mod'
import Fill from '../Fill'

const PREFIX = 'RSFCarousel'

const defaultClasses = {
  root: `${PREFIX}-root`,
  swipeWrap: `${PREFIX}-swipeWrap`,
  autoPlaySwipeableViews: `${PREFIX}-autoPlaySwipeableViews`,
  hideTouchArrows: `${PREFIX}-hideTouchArrows`,
}

const Root = styled('div')(() => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    flexBasis: '100%',
    '& img': {
      display: 'block',
    },
  },

  /**
   * Styles applied to wrapper element of the swipe container.
   */
  [`& .${defaultClasses.swipeWrap}`]: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,
    height: '100%',
    '& .react-swipeable-view-container, & .react-swipeable-view-container > div': {
      height: '100%',
    },
  },

  [`& .${defaultClasses.autoPlaySwipeableViews}`]: {
    overflowY: 'hidden',
    height: '100%',
  },
  [`& .${defaultClasses.hideTouchArrows}`]: {
    '@media not all and (hover:none)': {
      display: 'none',
    },
  },
}))

export const AutoPlaySwipeableViews = autoPlay(SwipeableViews)
export const VirtualizeSwipeableViews = virtualize(SwipeableViews)
export const AutoPlayVirtualizeSwipeableViews = autoPlay(VirtualizeSwipeableViews)

function useSelected(props) {
  const [selected, setSelected] = useState(0)
  if (props.setSelected) {
    return props
  }
  return { selected, setSelected }
}

/**
 * A grouped display of elements that shows one element at a time, and changes to peer elements by
 * swiping to the left or right, or by clicking arrows on the sides of the component. Generally used
 * as a non-Amp option for the [`CarouselComponent`](/apiReference/carousel/MediaCarousel#prop-CarouselComponent)
 * prop within a [`MediaCarousel`](/apiReference/carousel/MediaCarousel).
 */
const Carousel = React.forwardRef((props, ref) => {
  const {
    height,
    children,
    classes: c = {},
    className,
    style,
    swipeStyle,
    slideStyle,
    arrows,
    aboveAdornments,
    belowAdornments,
    onMouseEnter,
    onMouseLeave,
    onClick,
    indicators,
    autoplay,
    interval,
    infinite,
  } = props
  const classes = { ...defaultClasses, ...c }

  const { selected, setSelected } = useSelected(props)
  const count = children && children.length

  let Tag = infinite ? VirtualizeSwipeableViews : SwipeableViews
  Tag = autoplay ? AutoPlaySwipeableViews : Tag
  Tag = infinite && autoplay ? AutoPlayVirtualizeSwipeableViews : Tag

  const slideRenderer = ({ index }) => {
    const key = `slide-renderer-${index}`
    const child = children[mod(index, count)]
    if (!child) return null
    const slide = React.cloneElement(child)
    return <Fragment key={key}>{slide}</Fragment>
  }

  const onChangeIndex = useCallback(
    index => {
      if (!infinite) {
        setSelected(index)
        return
      }

      // carousel loop-around calculations
      let nextSelectedIndex = index
      if (nextSelectedIndex + 1 > count) {
        nextSelectedIndex = 0
      } else if (nextSelectedIndex < 0) {
        nextSelectedIndex = count - 1
      }

      setSelected(nextSelectedIndex)
    },
    [infinite, count, selected, setSelected],
  )

  return (
    <Root
      ref={ref}
      className={clsx(className, defaultClasses.root)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {aboveAdornments}
      <Fill height={height}>
        <div className={classes.swipeWrap}>
          <Tag
            index={selected}
            onChangeIndex={onChangeIndex}
            className={classes.autoPlaySwipeableViews}
            style={swipeStyle}
            slideStyle={slideStyle}
            slideRenderer={props.slideRenderer || slideRenderer}
            interval={interval}
            containerStyle={{ alignItems: 'center' }}
          />
          {arrows !== false && (
            <CarouselArrows
              className={arrows === 'desktop' ? classes.hideTouchArrows : null}
              selected={selected}
              setSelected={setSelected}
              count={count}
              infinite={infinite}
            />
          )}
          {indicators && <CarouselDots count={count} selected={selected} />}
        </div>
      </Fill>
      {belowAdornments}
    </Root>
  )
})

Carousel.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Set to `false` to hide arrows, `'desktop'` to only show them
   * on non-touch devices, `'all'` to always show arrows.
   */
  arrows: PropTypes.oneOf([false, 'desktop', 'all']),

  /**
   * Nodes to render above the Carousel.
   */
  aboveAdornments: PropTypes.arrayOf(PropTypes.element),

  /**
   * Nodes to render below the Carousel.
   */
  belowAdornments: PropTypes.arrayOf(PropTypes.element),

  /**
   * If `true`, the Carousel will automatically cycle through the media elements.
   */
  autoplay: PropTypes.bool,

  /**
   * If true, scrolling past the last slide will cycle back to the first
   */
  infinite: PropTypes.bool,

  /**
   * The interval time (in milliseconds) for [`autoplay`](#prop-autoplay).
   */
  interval: PropTypes.number,
  height: PropTypes.string,
  className: PropTypes.string,
  slideRenderer: PropTypes.func,
  style: PropTypes.object,
  swipeStyle: PropTypes.object,
  slideStyle: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onClick: PropTypes.func,
  indicators: PropTypes.bool,
}

Carousel.defaultProps = {
  indicators: true,
  arrows: 'desktop',
  autoplay: false,
  interval: 3000,
  infinite: true,
}

export default Carousel
