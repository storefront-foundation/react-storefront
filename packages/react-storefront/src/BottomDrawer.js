/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Card from '@material-ui/core/Card'
import withStyles from '@material-ui/core/styles/withStyles'

/**
 * A drawer that slides in from the bottom of the viewport.
 */
export const styles = theme => ({
  root: {
    position: 'fixed',
    bottom: 0,
    left: 0,
    right: 0,
    padding: '10px',
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    flexDirection: 'row',
    '& > *': {
      flex: 1
    }
  }
})

@withStyles(styles, { name: 'RSFBottomDrawer' })
export default class BottomDrawer extends Component {
  static propTypes = {
    /**
     * CSS classes to apply
     */
    classes: PropTypes.object
  }

  render() {
    const { classes, children } = this.props
    return <Card className={classes.root}>{children}</Card>
  }
}
