/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { Component } from 'react'
import PropTypes from 'prop-types'
import { inject } from 'mobx-react'

/**
 * An internal component that catches errors durring rendering, sets the
 * error, stack, and page properties of the app state accordingly, and calls
 * the registered error reporter if one is configured.
 */
@inject('app', 'history')
export default class ErrorBoundary extends Component {
  static propTypes = {
    /**
     * A function to call whenever an error occurs.  The function is passed an
     * object with `error` (the error message) and `stack` (the stack trace as a string).
     */
    onError: PropTypes.func
  }

  static defaultProps = {
    onError: Function.prototype
  }

  /**
   * When an error is caught, call the error reporter and update the app state
   * @param {Error} error
   * @param {Object} info
   */
  componentDidCatch(error, info) {
    const { app, history, onError } = this.props

    // report the error
    onError({ error, app, history })

    // update the app state to cause the error view to be displayed
    app.applyState({
      page: 'Error',
      error: error.message,
      stack: info.componentStack
    })

    // this is needed to recover from the error and render the error view
    this.forceUpdate()
  }

  render() {
    return this.props.children
  }
}
