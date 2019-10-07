/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'
import { inject, observer } from 'mobx-react'

/**
 * Wraps [ReactVisibilitySensor](https://github.com/joshwnj/react-visibility-sensor), and deactivates it
 * during page transitions so that it does not fire after the new view is rendered but before the
 * app scrolls to the top.
 */
@inject('app')
@observer
export default class VisibilitySensor extends Component {
  static defaultProps = {
    active: true
  }

  render() {
    const { app, active, ...others } = this.props

    return (
      <ReactVisibilitySensor active={active && !app._navigation.scrollResetPending} {...others} />
    )
  }
}
