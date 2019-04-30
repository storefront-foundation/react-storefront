/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import PropTypes from 'prop-types'
import classnames from 'classnames'

/**
 * Provides proper margins based on theme.margins.container.  All
 * additional props are spread to the underlying div element.
 */
export const styles = theme => ({
  root: {
    margin: `0 auto`,
    maxWidth: theme.maxWidth || '100vw',
  },
  inset: {
    padding: `0 ${theme.margins && theme.margins.container}px`,
  },
})

@withStyles(styles, { name: 'RSFContainer' })
export default class Container extends Component {
  static propTypes = {
    /**
     * CSS classes to apply
     */
    classes: PropTypes.object,

    /**
     * Set to false to remove the left and right padding.
     */
    inset: PropTypes.bool,
  }

  static defaultProps = {
    inset: true,
  }

  render() {
    const { classes, className, children, inset, ...rest } = this.props

    return (
      <div className={classnames(classes.root, className, { [classes.inset]: inset })} {...rest}>
        {children}
      </div>
    )
  }
}
