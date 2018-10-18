/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'

export const styles = theme => ({
  root: {
    margin: `${theme.spacing.row || 15}px 0`
  }
});

@withStyles(styles, { name: 'RSFRow' })
export default class Row extends Component {
  render() {
    const { classes, className, children, ...other } = this.props
    return <div className={classnames(classes.root, className)} {...other}>{children}</div>
  }
}
