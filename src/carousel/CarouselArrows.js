import PropTypes from 'prop-types'
import React, { useCallback } from 'react'
import clsx from 'clsx'
import makeStyles from '@material-ui/core/styles/makeStyles'
import { IconButton } from '@material-ui/core'
import { ChevronLeft, ChevronRight } from '@material-ui/icons'

export const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  arrows: {},

  /**
   * Styles applied to each of the arrow icon buttons.
   */
  arrow: {
    position: 'absolute',
    top: '50%',
    marginTop: '-24px',
  },

  /**
   * Styles applied to the left arrow icon buttons.
   */
  leftArrow: {
    left: 0,
  },

  /**
   * Styles applied to the right arrow icon buttons.
   */
  rightArrow: {
    right: 0,
  },

  /**
   * Styles applied to each of the icon elements.
   */
  icon: {},
})

const useStyles = makeStyles(styles, { name: 'RSFCarouselArrows' })

/**
 * Arrows that are overlaid onto a [`Carousel`](/apiReference/carousel/Carousel) that will change
 * the slide shown when clicked.
 */
export default function CarouselArrows({
  className,
  classes,
  selected,
  count,
  setSelected,
  infinite,
  leftArrowLabel,
  rightArrowLabel,
}) {
  classes = useStyles({ classes })

  const createOnClickArrow = useCallback(
    idxChange => evt => {
      evt.preventDefault()
      setSelected(selected + idxChange)
    },
    [selected, setSelected],
  )

  return (
    <div className={clsx(classes.arrows, className)}>
      {(selected !== 0 || infinite) && (
        <IconButton
          className={clsx(classes.arrow, classes.leftArrow)}
          onClick={createOnClickArrow(-1)}
          aria-label={leftArrowLabel}
        >
          <ChevronLeft classes={{ root: classes.icon }} />
        </IconButton>
      )}
      {(selected !== count - 1 || infinite) && (
        <IconButton
          className={clsx(classes.arrow, classes.rightArrow)}
          onClick={createOnClickArrow(1)}
          aria-label={rightArrowLabel}
        >
          <ChevronRight classes={{ root: classes.icon }} />
        </IconButton>
      )}
    </div>
  )
}

CarouselArrows.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * CSS class to apply to the root element.
   */
  className: PropTypes.string,

  /**
   * Index of the currently selected slide in the [`Carousel`](/apiReference/carousel/Carousel).
   */
  selected: PropTypes.number,

  /**
   * Function to change the value of [`selected`](#prop-selected).
   */
  setSelected: PropTypes.func,

  /**
   * Total number of slides in the [`Carousel`](/apiReference/carousel/Carousel).
   */
  count: PropTypes.number,

  /**
   * Label given to the left arrow for accessbility purposes.
   */
  leftArrowLabel: PropTypes.string,

  /**
   * Label given to the right arrow for accessbility purposes.
   */
  rightArrowLabel: PropTypes.string,
}

CarouselArrows.defaultProps = {
  leftArrowLabel: 'Previous',
  rightArrowLabel: 'Next',
}
