/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { inject, observer, disposeOnUnmount } from 'mobx-react'
import { reaction } from 'mobx'
import { isServer } from './environment'

/**
 * Use this component to report errors to the error logging service of your choice.
 * Any time an error occurs in your app, the function you pass to `onError` prop will
 * be called.  This includes errors that occur in handlers on the server as well
 * as react rendering on both client and server.  Errors that occur on the server
 * will be reported from the server.  Errors that occur on the client will be reported
 * from the client.
 *
 * Example usage:
 *
 *  import React, { Component } from 'react'
 *  import ErrorReporter from 'react-storefront/ErrorReporter'
 *
 *  class App extends Component {
 *
 *    render() {
 *      return (
 *        <div>
 *          <ErrorReporter onError={this.reportError}/>
 *          // ... the rest of your app goes here
 *        </div>
 *      )
 *    }
 *
 *    reportError = ({ error, stack }) => {
 *      // send error to some error reporting service
 *    }
 *
 *  }
 */
@inject('app')
@observer
export default class ErrorReporter extends Component {
  static propTypes = {
    /**
     * A function to call whenever an error occurs.  The function is passed an
     * object with `error` (the error message) and `stack` (the stack trace as a string).
     */
    onError: PropTypes.func.isRequired
  }

  componentWillMount() {
    if (isServer()) {
      // here we only report errors on the server so they aren't duplicated
      // when the app mounts on the client.
      this.reportError()
    }
  }

  reportError = () => {
    const { error, stack } = this.props.app

    if (error) {
      this.props.onError({ error, stack })
    }
  }

  render() {
    return null
  }

  // call reportError whenever app.error changes
  @disposeOnUnmount
  disposer = reaction(() => this.props.app.error, this.reportError)
}
