/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import IconButton from '@material-ui/core/IconButton'
import PropTypes from 'prop-types'

export const styles = theme => ({
  wrap: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    ...theme.typography.caption
  }
})

/**
 * A toolbar button with optional label.  Use these in your AppBar. All additional
 * props are spread to the underlying material-ui IconButton.
 */
@withStyles(styles, { name: 'RSFToolbarButton' })
export default class ToolbarButton extends Component {
  static propTypes = {
    /**
     * The icon
     */
    icon: PropTypes.element.isRequired,

    /**
     * The label text (optional)
     */
    label: PropTypes.oneOfType([PropTypes.string, PropTypes.element])
  }

  render() {
    const { icon, label, classes, children, ...others } = this.props
    const { wrap, ...buttonClasses } = classes

    return (
      <IconButton classes={buttonClasses} {...others}>
        <div className={wrap}>
          {icon}
          <div>{label}</div>
        </div>
        {children}
      </IconButton>
    )
  }
}
