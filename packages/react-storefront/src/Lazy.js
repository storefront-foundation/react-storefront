/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import ReactVisibilitySensor from 'react-visibility-sensor'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'
import { reaction } from 'mobx'
import isSSR from './utils/isSSR'
import { isClient } from './environment'

export const styles = () => ({
  root: {
    minHeight: 1,
    minWidth: 1
  }
})

@withStyles(styles, { name: 'RSFLazy' })
@inject('app')
@observer
export default class Lazy extends Component {
  static defaultProps = {
    server: true,
    client: true
  }

  constructor({ app, client, server }) {
    super()

    this.state = {
      visible: app.amp
    }

    if (isSSR() && server === false) {
      this.state.visible = true
    } else if (isClient() && client === false) {
      this.state.visible = true
    }
  }

  componentDidMount() {
    this.dispose = reaction(() => this.props.app.location.uri, this.onRouteChange)
  }

  componentWillUnmount() {
    this.dispose()
  }

  onRouteChange = () => {
    if (this.state.visible) {
      this.setState({ visible: false })
    }
  }

  onChange = v => {
    const { visible } = this.state

    if (!visible && v) {
      this.setState({ visible: true })
    }
  }

  render() {
    const {
      app,
      children,
      className,
      classes,
      visibilitySensorProps,
      server,
      client,
      ...otherProps
    } = this.props

    const { visible } = this.state

    return (
      <ReactVisibilitySensor
        onChange={this.onChange}
        active={!visible && !app.scrollResetPending}
        partialVisibility
        {...visibilitySensorProps}
      >
        <div className={classnames(classes.root, className)} {...otherProps}>
          {visible && children}
        </div>
      </ReactVisibilitySensor>
    )
  }
}
