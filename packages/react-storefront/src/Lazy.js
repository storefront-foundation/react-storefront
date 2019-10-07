/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import VisibilitySensor from './VisibilitySensor'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import { inject, observer } from 'mobx-react'

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
  state = {
    visible: false
  }

  onChange = v => {
    const { visible } = this.state

    if (!visible && v) {
      this.setState({ visible: true })
    }
  }

  render() {
    const { app, children, className, classes, ...otherProps } = this.props
    const { visible } = this.state

    return (
      <VisibilitySensor
        onChange={this.onChange}
        active={!visible && !app._navigation.scrollResetPending}
        partialVisibility
      >
        <div className={classnames(classes.root, className)} {...otherProps}>
          {visible && children}
        </div>
      </VisibilitySensor>
    )
  }
}
