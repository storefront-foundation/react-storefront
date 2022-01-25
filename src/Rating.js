import React from 'react'
import { styled } from '@mui/material/styles'
import { Star, StarBorder, StarHalf } from '@mui/icons-material'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Hbox } from './Box'

const PREFIX = 'RSFRating'

const defaultClasses = {
  root: `${PREFIX}-root`,
  filledEmpty: `${PREFIX}-filledEmpty`,
  blank: `${PREFIX}-blank`,
  reviewsLabel: `${PREFIX}-reviewsLabel`,
}

const Root = styled('span')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    '& svg': {
      color: theme.palette.rating,
      height: '16px',
      width: '16px',
      display: 'block',
    },
  },

  /**
   * Styles applied to an empty rating icon.
   */
  [`& .${defaultClasses.filledEmpty}`]: {
    fill: theme.palette.divider,
  },

  /**
   * Styles applied to the root element when [`value`](#prop-value) is `0`.
   */
  [`& .${defaultClasses.blank}`]: {
    '& svg': {
      color: theme.palette.divider,
    },
  },

  /**
   * Styles applied to the label element.
   */
  [`&.${defaultClasses.reviewsLabel}`]: {
    marginLeft: '3px',
  },
}))

/**
 * Displays a star rating corresponding to the provided value
 */
export {}

export default function Rating({
  iconFull,
  iconHalf,
  iconEmpty,
  classes: c = {},
  value,
  label,
  reviewCount,
  className,
  product,
  fillEmpty,
}) {
  const classes = { ...defaultClasses, ...c }
  const stars = []

  if (product) {
    reviewCount = product.reviewCount
    value = product.rating
  }

  const IconFull = iconFull || Star
  const IconHalf = iconHalf || StarHalf
  const IconEmpty = iconEmpty || StarBorder

  for (let i = 1; i <= 5; i++) {
    if (value == null || value >= i) {
      stars.push(<IconFull key={i} />)
    } else if (value >= i - 0.5) {
      stars.push(<IconHalf key={i} />)
    } else if (fillEmpty) {
      stars.push(<IconFull className={classes.filledEmpty} key={i} />)
    } else {
      stars.push(<IconEmpty key={i} />)
    }
  }

  return (
    <Hbox>
      <Root className={clsx(classes.root, className, { [classes.blank]: value == null })}>
        {stars}
      </Root>
      {reviewCount ? (
        <Root className={classes.reviewsLabel}>
          ({reviewCount}
          {label(reviewCount)})
        </Root>
      ) : null}
    </Hbox>
  )
}

Rating.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The number of stars to display.  Can be an integer or a float ending in .5.
   */
  value: PropTypes.number,

  /**
   * The number of reviews.
   */
  reviewCount: PropTypes.number,

  /**
   * A function that returns the label displayed to the right of the review count.
   * For example: `<Rating label={reviewCount => <span> {reviewCount == 1 ? 'review' : 'reviews'}</span>}/>`.
   * This value used in this example is the default.
   */
  label: PropTypes.func,

  /**
   * Can be used to as an alternative to setting `value` and `reviewCount` individually.
   */
  product: PropTypes.object,

  /**
   * Custom full point icon.
   */
  iconFull: PropTypes.elementType,

  /**
   * Custom half point icon.
   */
  iconHalf: PropTypes.elementType,

  /**
   * Custom empty icon; will override `fillEmpty` icon.
   */
  iconEmpty: PropTypes.elementType,

  /**
   * If `true`, use a filled icon with light gray background for empty icon
   */
  fillEmpty: PropTypes.bool,
  className: PropTypes.string,
}

Rating.defaultProps = {
  label: reviewCount => <span> {reviewCount == 1 ? 'review' : 'reviews'}</span>,
  fillEmpty: false,
}
