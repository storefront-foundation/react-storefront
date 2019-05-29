/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import classnames from 'classnames'
import PropTypes from 'prop-types'

/**
 * A flex container.  All additional props are spread to the style of the underlying div.
 */
export const styles = theme => ({
  root: {
    display: 'flex'
  },
  split: {
    justifyContent: 'space-between',
    alignItems: 'center'
  }
})

@withStyles(styles, { name: 'RSFBox' })
export default class Box extends Component {
  static propTypes = {
    /**
     * CSS classes to apply
     */
    classes: PropTypes.object,

    /**
     * True to split items on opposite sides of the box by applying justify-content: 'space-between'
     */
    split: PropTypes.bool
  }

  render() {
    const { className, classes, split = false, children, style, ...other } = this.props

    return (
      <div
        className={classnames(classes.root, className, { [classes.split]: split })}
        style={{ ...other, ...style }}
      >
        {children}
      </div>
    )
  }
}

/**
 * A flex container with horizontal layout. All additional props are spread to the style
 * of the underlying div.
 */
export function Hbox(props) {
  props = { ...props, flexDirection: 'row' }
  return <Box alignItems="center" {...props} />
}

Hbox.propTypes = {
  /**
   * CSS classes to apply
   */
  classes: PropTypes.object,

  /**
   * True to split items on opposite sides of the box by applying justify-content: 'space-between'
   */
  split: PropTypes.bool
}

/**
 * A flex container with vertical layout. All additional props are spread to
 * the style of the underlying div.
 */
export function Vbox(props) {
  props = { ...props, flexDirection: 'column' }
  return <Box {...props} />
}

Vbox.propTypes = {
  /**
   * CSS classes to apply
   */
  classes: PropTypes.object,

  /**
   * True to split items on opposite sides of the box by applying justify-content: 'space-between'
   */
  split: PropTypes.bool
}
