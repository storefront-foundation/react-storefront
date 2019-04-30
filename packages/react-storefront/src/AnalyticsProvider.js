/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import analytics, { configureAnalytics } from './analytics'
import { Provider, inject } from 'mobx-react'

/**
 * Use this component to register your analytics targets.
 *
 * import AnalyticsProvider from 'react-storefront/AnalyticsProvider'
 * import GoogleAnalyticsTarget from 'react-storefront-extensions/GoogleAnalyticsTarget'
 *
 * Example:
 *
 * ```
 *  <AnalyticsProvider
 *    targets={() => [
 *      new GoogleAnalyticsTarget({
 *        trackingID: 'ABC123'
 *      })
 *    ])}
 *  >
 *    <App/>
 *  </AnalyticsProvider>
 * ```
 *
 * Components that are decendents of AnalyticsProvider can use `@inject('analytics')` to get access to
 * an object which can be used to broadcase analytics events to targets:
 *
 * ```
 *  import React, { Component } from 'react'
 *  import Button from '@material-ui/core/Button'
 *  import { inject } from 'mobx-react'
 *
 *  @inject('analytics')
 *  class MyComponent extends Component {
 *
 *    render() {
 *      return (
 *        <Button onClick={this.fireAnalyticsEvent}>Click Me</Button>
 *      )
 *    }
 *
 *    // This will call the someEvent() method on all configured analytics targets.
 *    fireAnalyticsEvent = () => {
 *      const eventData = { foo: 'bar' }
 *      this.props.analytics.fire('someEvent', eventData) // analytics prop is provided by the @inject('analytics') decorator.
 *    }
 *
 *  }
 * ```
 */
@inject(({ app }) => ({ amp: app && app.amp }))
export default class AnalyticsProvider extends Component {
  static propTypes = {
    /**
     * Function which should return desired analytics targets to configure.
     */
    targets: PropTypes.func.isRequired,
  }
  constructor(props) {
    super(props)
    // Configure analytics for server side AMP rendering
    if (props.targets && props.amp) {
      configureAnalytics(...props.targets(false))
    }
  }
  componentDidMount() {
    if (this.props.targets) {
      configureAnalytics(...this.props.targets())
    }
  }
  render() {
    return <Provider analytics={analytics}>{this.props.children}</Provider>
  }
}
