import React from 'react'
import { styled } from '@mui/material/styles';
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { alpha } from '@mui/material/styles'

const PREFIX = 'RSFCarouselDots';

const classes = {
  dots: `${PREFIX}-dots`,
  dot: `${PREFIX}-dot`,
  dotSelected: `${PREFIX}-dotSelected`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  /**
   * Styles applied to the root element.
   */
  [`& .${classes.dots}`]: {
    position: 'absolute',
    bottom: '5px',
    textAlign: 'center',
    width: '100%',
  },

  /**
   * Styles applied to each dot element.
   */
  [`&.${classes.dot}`]: {
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
  [`&.${classes.dotSelected}`]: {
    backgroundColor: theme.palette.text.primary,
  }
}));

/**
 * An overlay shown at the bottom of a [`Carousel`](/apiReference/carousel/Carousel) that shows a
 * sequence of dots representing the slides in the Carousel.
 */
function CarouselDots({ selected, count, }) {
  const dots = []


  for (let i = 0; i < count; i++) {
    dots.push(
      <Root
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
