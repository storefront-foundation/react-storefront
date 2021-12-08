import React, { Component } from 'react'
import PropTypes from 'prop-types'

/**
 * An internal component that catches errors durring rendering, sets the
 * error, stack, and page properties of the app state accordingly, and calls
 * the registered error reporter if one is configured.
 */
export default class ErrorBoundary extends Component {
  static propTypes = {
    /**
     * A function to call whenever an error occurs.  The function is passed an
     * object with `error` (the error message) and `stack` (the stack trace as a string).
     */
    onError: PropTypes.func,
  }

  static defaultProps = {
    onError: Function.prototype,
  }

  static getDerivedStateFromError(error) {
    return { error }
  }

  state = {
    error: null,
  }

  componentDidMount() {
    const { onError } = this.props

    this.windowErrorEvent = window.addEventListener('error', event => {
      onError({ error: event.error })
    })

    this.windowUnhandledRejectionEvent = window.addEventListener('unhandledrejection', event => {
      onError({ error: event.reason })
    })
  }

  componentWillUnmount() {
    window.removeEventListener('error', this.windowErrorEvent)
    window.removeEventListener('unhandledrejection', this.windowUnhandledRejectionEvent)
  }

  /**
   * When an error is caught, call the error reporter and update the app state
   * @param {Error} error
   * @param {Object} info
   */
  componentDidCatch(error) {
    const { onError } = this.props

    // report the error
    onError({ error })
  }

  render() {
    if (this.state.error) {
      return <div>{this.state.error.message}</div>
    }

    return this.props.children
  }
}
