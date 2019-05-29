/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Snackbar from '@material-ui/core/Snackbar'
import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'

/**
 * A snackbar that automatically displays when a new version of the service worker is available.
 * By default the component only shows when the app is launched from the user's homescreen on android devices.
 * Additonal props are spread to the underlying material-ui Snackbar component
 */
export default class UpdateNotification extends Component {
  state = {
    notifyUpdate: false
  }

  static propTypes = {
    /**
     * The message to display
     */
    message: PropTypes.string,

    /**
     * The text for the reload button.
     */
    reloadButtonText: PropTypes.string
  }

  static defaultProps = {
    message: 'An new version of this app is available.',
    reloadButtonText: 'RELOAD'
  }

  render() {
    const { message, reloadButtonText, ...others } = this.props
    const { notifyUpdate } = this.state

    return (
      <Snackbar
        open={notifyUpdate}
        autoHideDuration={6000}
        onClose={this.handleNotifyClose}
        message={message}
        action={[
          <Button key="undo" color="secondary" size="small" onClick={this.refresh}>
            {reloadButtonText}
          </Button>,
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            onClick={this.handleNotifyClose}
          >
            <CloseIcon />
          </IconButton>
        ]}
        {...others}
      />
    )
  }

  componentDidMount() {
    // published in registerServiceWorker.js
    document.addEventListener('moov-update-available', () => {
      console.log('new service worker installed')
      this.setState({ notifyUpdate: true })
    })
  }

  handleNotifyClose = () => {
    this.setState({ notifyUpdate: false })
  }

  refresh = () => {
    window.location.reload()
  }
}
