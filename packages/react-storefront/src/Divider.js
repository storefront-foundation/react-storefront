/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import classnames from 'classnames'

export const styles = theme => ({
  root: {
    background: theme.palette.divider,
    alignSelf: 'stretch'
  },
  vertical: {
    height: '100%',
    width: '1px'
  },
  horizontal: {
    height: '1px'
  }
})

@withStyles(styles, { name: 'RSFDivider' })
export default class Divider extends Component {
  static propTypes = {
    /**
     * True to display a vertical divider
     */
    vertical: PropTypes.bool,

    /**
     * True to display a horizontal divider
     */
    horizontal: PropTypes.bool,

    /**
     * CSS classes to apply
     */
    classes: PropTypes.object
  }

  render() {
    let { classes, className, vertical, horizontal, ...rest } = this.props

    if (!vertical && !horizontal) horizontal = true

    return (
      <div
        className={classnames(className, classes.root, {
          [classes.vertical]: vertical,
          [classes.horizontal]: horizontal
        })}
        {...rest}
      />
    )
  }
}
