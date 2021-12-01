import React from 'react'
import clsx from 'clsx'
import { makeStyles } from '@mui/styles'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  dots: {
    position: 'absolute',
    bottom: '5px',
    textAlign: 'center',
    width: '100%',
  },

  /**
   * Styles applied to each dot element.
   */
  dot: {
    backgroundColor: alpha(theme.palette.text.primary, 0.25),
    width: 8,
    height: 8,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    // Same duration as SwipeableViews animation
    transitionDuration: '0.35s',
  },

  /**
   * Styles applied to the dot representing the selected slide.
   */
  dotSelected: {
    backgroundColor: theme.palette.text.primary,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCarouselDots' })

/**
 * An overlay shown at the bottom of a [`Carousel`](/apiReference/carousel/Carousel) that shows a
 * sequence of dots representing the slides in the Carousel.
 */
function CarouselDots({ selected, count, classes }) {
  const dots = []
  classes = useStyles({ classes })

  for (let i = 0; i < count; i++) {
    dots.push(
      <div
        key={i}
        className={clsx({
          [classes.dot]: true,
          [classes.dotSelected]: selected === i,
        })}
      />,
    )
  }

  return <div className={classes.dots}>{dots}</div>
}

CarouselDots.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The total number of dots to show.
   */
  count: PropTypes.number.isRequired,

  /**
   * The index of the selected dot.
   */
  selected: PropTypes.number.isRequired,
}

export default React.memo(CarouselDots)
