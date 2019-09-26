/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Helmet from 'react-helmet'
import Paper from '@material-ui/core/Paper'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'

export const styles = theme => ({
  ampDrawer: {
    position: 'fixed',
    transform: 'translateY(100%)',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    zIndex: theme.zIndex.amp.modal + 1,
    transition: 'transform 225ms cubic-bezier(0, 0, 0.2, 1) 0ms'
  },
  ampDrawerOpen: {
    transform: 'translateY(0)'
  }
})

@withStyles(styles, { name: 'RSFAmpSearchDrawer' })
export default class AmpSearchDrawer extends Component {
  render() {
    const { classes, children } = this.props

    return (
      <>
        <Helmet>
          <script
            async
            custom-element="amp-list"
            src="https://cdn.ampproject.org/v0/amp-list-0.1.js"
          />
          <script
            async
            custom-template="amp-mustache"
            src="https://cdn.ampproject.org/v0/amp-mustache-0.2.js"
          />
        </Helmet>
        <div
          className={classes.ampDrawer}
          amp-bind={`class=>rsfSearchDrawer.open ? "${classnames(
            classes.ampDrawer,
            classes.ampDrawerOpen
          )}" : "${classes.ampDrawer}"`}
        >
          <Paper>{children}</Paper>
        </div>
      </>
    )
  }
}
