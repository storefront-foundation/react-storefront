/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CloseOffIcon from '@material-ui/icons/CloudOff'

@withStyles(theme => ({
  container: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: '20px',
  },
  icon: {
    fontSize: 60,
    color: '#999',
  },
  message: {
    color: '#999',
  },
}))
export default class Offline extends Component {
  render() {
    const { classes } = this.props
    return (
      <div className={classes.container}>
        <CloseOffIcon className={classes.icon} />
        <Typography variant="h6" component="h1" className={classes.message}>
          You're offline
        </Typography>
        <Typography variant="caption" className={classes.message}>
          Please check your internet connection
        </Typography>
      </div>
    )
  }
}
