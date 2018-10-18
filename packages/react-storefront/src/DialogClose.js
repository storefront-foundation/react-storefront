/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import IconButton from '@material-ui/core/IconButton'
import Close from '@material-ui/icons/Close'

/**
 * A close button for modal dialogs. All props are spread to the underlying
 * Material UI IconButton.
 */
export default class DialogClose extends Component {
  render() {
    const { style = {}, onClick, ...props } = this.props

    return (
      <IconButton 
        onClick={onClick} 
        style={{ position: 'absolute', top: 0, right: 0, ...style }}
        {...props}
      >
        <Close/>
      </IconButton>
    )
  }
}