/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

/**
 * Renders a simple div with flex: 1 to be used as a spacer.  Since this is a
 * common case, the main purposed of this class is to minimize the amount of
 * css generated for an app.
 */
export const styles = theme => ({
  root: {
    flex: 1,
  },
})

@withStyles(styles, { name: 'RSFSpacer' })
export default class Spacer extends Component {
  render() {
    return <div className={this.props.classes.root} />
  }
}
