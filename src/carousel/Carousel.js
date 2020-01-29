import React, { useState } from 'react'
import clsx from 'clsx'
import { makeStyles } from '@material-ui/core/styles'
import SwipeableViews from 'react-swipeable-views'
import { autoPlay } from 'react-swipeable-views-utils'
import PropTypes from 'prop-types'
import CarouselDots from './CarouselDots'
import CarouselArrows from './CarouselArrows'
import Fill from '../Fill'

const styles = theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    '& img': {
      display: 'block',
    },
  },

  swipeWrap: {
    position: 'relative',
    overflow: 'hidden',
    flex: 1,

    '& .react-swipeable-view-container, & > div:first-child': {
      height: '100%',
    },
  },

  '@media (hover:none)': {
    hideTouchArrows: {
      display: 'none',
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCarousel' })
const AutoPlaySwipeableViews = autoPlay(SwipeableViews)

function useSelected(props) {
  if (props.setSelected) {
    return props
  } else {
    const [selected, setSelected] = useState(0)
    return { selected, setSelected }
  }
}

const Carousel = React.forwardRef((props, ref) => {
  let {
    height,
    children,
    classes,
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
  } = props

  classes = useStyles({ classes })

  const { selected, setSelected } = useSelected(props)
  const count = children && children.length

  return (
    <div
      ref={ref}
      className={clsx(className, classes.root)}
      style={style}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {aboveAdornments}
      <Fill height={height}>
        <div className={classes.swipeWrap}>
          <AutoPlaySwipeableViews
            index={selected}
            onChangeIndex={i => setSelected(i)}
            style={swipeStyle}
            slideStyle={slideStyle}
            autoplay={autoplay}
            interval={interval}
          >
            {children}
          </AutoPlaySwipeableViews>
          {arrows !== false && (
            <CarouselArrows
              className={arrows === 'desktop' ? classes.hideTouchArrows : null}
              selected={selected}
              setSelected={setSelected}
              count={count}
              selected={selected}
            />
          )}
          {indicators && <CarouselDots count={count} selected={selected} />}
        </div>
      </Fill>
      {belowAdornments}
    </div>
  )
})

Carousel.propTypes = {
  /**
   * Set to `false` to hide arrows, 'desktop' to only show them
   * on non-touch devices, 'all' to always show arrows.
   */
  arrows: PropTypes.oneOf([false, 'desktop', 'all']),
  aboveAdornments: PropTypes.arrayOf(PropTypes.element),
  belowAdornments: PropTypes.arrayOf(PropTypes.element),
  autoplay: PropTypes.bool,
  interval: PropTypes.number,
}

Carousel.defaultProps = {
  indicators: true,
  arrows: 'desktop',
  autoplay: false,
  interval: 3000,
}

export default Carousel
