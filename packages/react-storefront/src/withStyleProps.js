/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import withStyles from '@material-ui/core/styles/withStyles'

/**
 * Decorator for mapping a component's props to JSS styles
 * @param {Object} styles
 * @return {React.Component}
 *
 * Example:
 *
 *  import withStyleProps from 'react-storefront'
 *  import React, { Component } from 'react'
 *
 *  @withStyleProps(({ theme, height }) => ({
 *    root: {
 *      height: `${height}px`,
 *    }
 *  }))
 *  export default class MyComponent extends Component {
 *    render() {
 *      return <div className={this.props.classes.root}>{this.props.children}</div>
 *    }
 *  }
 */
export default function withStyleProps(styles, options) {
  return Component => props => {
    const Comp = withStyles(theme => styles({ ...props, theme }), options)(Component)
    return <Comp {...props} />
  }
}
