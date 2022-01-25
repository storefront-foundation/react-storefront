import PropTypes from 'prop-types'
import { styled } from '@mui/material/styles'
import React, { useCallback } from 'react'
import clsx from 'clsx'
import { IconButton } from '@mui/material'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'

const PREFIX = 'RSFCarouselArrows'

const defaultClasses = {
  arrows: `${PREFIX}-arrows`,
  arrow: `${PREFIX}-arrow`,
  leftArrow: `${PREFIX}-leftArrow`,
  rightArrow: `${PREFIX}-rightArrow`,
  icon: `${PREFIX}-icon`,
}

const Root = styled('div')(() => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.arrows}`]: {},

  /**
   * Styles applied to each of the arrow icon buttons.
   */
  [`& .${defaultClasses.arrow}`]: {
    position: 'absolute',
    top: '50%',
    marginTop: '-24px',
  },

  /**
   * Styles applied to the left arrow icon buttons.
   */
  [`& .${defaultClasses.leftArrow}`]: {
    left: 0,
  },

  /**
   * Styles applied to the right arrow icon buttons.
   */
  [`& .${defaultClasses.rightArrow}`]: {
    right: 0,
  },

  /**
   * Styles applied to each of the icon elements.
   */
  [`& .${defaultClasses.icon}`]: {},
}))

export {}

/**
 * Arrows that are overlaid onto a [`Carousel`](/apiReference/carousel/Carousel) that will change
 * the slide shown when clicked.
 */
export default function CarouselArrows({
  className,
  classes: c = {},
  selected,
  count,
  setSelected,
  infinite,
  leftArrowLabel,
  rightArrowLabel,
}) {
  const classes = { ...defaultClasses, ...c }

  const createOnClickArrow = useCallback(
    idxChange => evt => {
      evt.preventDefault()

      if (!infinite) {
        setSelected(selected + idxChange)
        return
      }

      // carousel loop-around calculations
      let nextSelectedIndex = selected + idxChange
      if (nextSelectedIndex + 1 > count) {
        nextSelectedIndex = 0
      } else if (nextSelectedIndex < 0) {
        nextSelectedIndex = count - 1
      }

      setSelected(nextSelectedIndex)
    },
    [selected, setSelected, count, infinite],
  )

  return (
    <Root className={clsx(classes.arrows, className)}>
      {(selected !== 0 || infinite) && (
        <IconButton
          className={clsx(classes.arrow, classes.leftArrow)}
          onClick={createOnClickArrow(-1)}
          aria-label={leftArrowLabel}
          size="large"
        >
          <ChevronLeft classes={{ root: classes.icon }} />
        </IconButton>
      )}
      {(selected !== count - 1 || infinite) && (
        <IconButton
          className={clsx(classes.arrow, classes.rightArrow)}
          onClick={createOnClickArrow(1)}
          aria-label={rightArrowLabel}
          size="large"
        >
          <ChevronRight classes={{ root: classes.icon }} />
        </IconButton>
      )}
    </Root>
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
  infinite: PropTypes.bool,
}

CarouselArrows.defaultProps = {
  leftArrowLabel: 'Previous',
  rightArrowLabel: 'Next',
}
