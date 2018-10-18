/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from "prop-types"
import withStyles from "@material-ui/core/styles/withStyles"

export const styles = {
  hidden: {
    display: 'none'
  }
}

/**
 * Renders an element that is hidden when a specific property in amp-state is set to true
 */
@withStyles(styles, { name: 'RSFAmpHidden' })
export default class AmpHidden extends Component {

  static propTypes = {
    /**
     * The type of component to use.  Defaults to div.
     */
    component: PropTypes.oneOfType([ PropTypes.string, PropTypes.func ]),

    /**
     * The boolean amp-bind expression that will result in this component being hidden when true.
     */
    bind: PropTypes.string,

    /**
     * Set to true to hide the component on initial render
     */
    hidden: PropTypes.bool
  }

  static defaultProps = {
    component: 'div',
    hidden: false
  }

  render() {
    const { classes, hidden, bind, component, ...others } = this.props

    return (
      React.createElement(component, {
        "amp-bind": `class=>${bind} ? '${classes.hidden}' : null`,
        className: hidden ? classes.hidden : null,
        ...others
      })
    )
  }

}