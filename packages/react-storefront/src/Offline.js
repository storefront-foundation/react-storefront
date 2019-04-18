/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core'
import Typography from '@material-ui/core/Typography'
import CloseOffIcon from '@material-ui/icons/CloudOff'
import PropTypes from 'prop-types'

@withStyles(theme => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: '40px',
    color: '#999',
  },
  icon: {
    fontSize: 60,
    color: '#999',
  },
  heading: {},
  message: {},
}))
export default class Offline extends Component {
  static propTypes = {
    /**
     * Text or an element to display as the heading.
     */
    heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * Text or an element to deplay as the message.
     */
    message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

    /**
     * An icon to display.
     */
    Icon: PropTypes.func,
  }

  static defaultProps = {
    heading: "You're offline",
    message: 'Please check your internet connection',
    Icon: CloseOffIcon,
  }

  render() {
    const { classes, heading, message, Icon } = this.props

    return (
      <div className={classes.root}>
        <Icon className={classes.icon} />
        <Typography variant="h6" component="h1" className={classes.heading}>
          {heading}
        </Typography>
        <Typography variant="caption" className={classes.message}>
          {message}
        </Typography>
      </div>
    )
  }
}
