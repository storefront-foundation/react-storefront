/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Star from '@material-ui/icons/Star'
import StarBorder from '@material-ui/icons/StarBorder'
import StarHalf from '@material-ui/icons/StarHalf'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import classnames from 'classnames'
import { Hbox } from './Box'

/**
 * Displays a star rating corresponding to the provided value
 */
export const styles = theme => ({
  root: {
    display: 'flex',
    '& svg': {
      color: theme.palette.rating,
      height: '16px',
      width: '16px',
      marginLeft: '-2px',
      display: 'block'
    }
  },
  blank: {
    '& svg': {
      color: theme.palette.divider
    }
  },
  reviewsLabel: {
    marginLeft: '3px'
  }
});

@withStyles(styles, { name: 'RSFRating' })
export default class Rating extends Component {

  static propTypes = {
    /**
     * CSS classes to apply
     */
    classes: PropTypes.object,

    /**
     * The number of stars to display.  Can be an integer or a float
     * ending in .5.
     */
    value: PropTypes.number,

    /**
     * The number of reviews
     */
    reviewCount: PropTypes.number,

    /**
     * A function that returns the label displayed to the right of the review count.
     * For example: `<Rating label={reviewCount => <span> {reviewCount == 1 ? 'review' : 'reviews'}</span>}/>`.  
     * This value used in this example is the default.
     */
    label: PropTypes.func,

    /**
     * An instance of ProductModelBase.  You can set this instead of setting value an reviewCount individually.
     */
    product: PropTypes.object
  }

  static defaultProps = {
    label: reviewCount => <span> {reviewCount == 1 ? 'review' : 'reviews'}</span>
  }

  render() {
    let { classes, value, label, reviewCount, className, product } = this.props
    let stars = []

    if (product) {
      reviewCount = product.reviewCount
      value = product.rating
    }
  
    for (let i=1; i<=5; i++) {
      if (value == null || value >= i) {
        stars.push(<Star key={i}/>)
      } else if (value >= i - 0.5) {
        stars.push(<StarHalf key={i}/>)
      } else {
        stars.push(<StarBorder key={i}/>)
      }
    }
  
    return (
      <Hbox>
        <div className={classnames(classes.root, className, { [classes.blank]: value == null })}>
          {stars}
        </div>
        { reviewCount ? (
          <div className={classes.reviewsLabel}>({reviewCount}{label(reviewCount)})</div>
        ) : null}
      </Hbox>
    )
  }
}
