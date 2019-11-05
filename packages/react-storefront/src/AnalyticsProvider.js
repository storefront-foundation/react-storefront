/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import analytics, { configureAnalytics, activate } from './analytics'
import { Provider, inject } from 'mobx-react'
import ttiPolyfill from 'tti-polyfill'
import { getCookie } from './utils/cookie'

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
@inject(({ app, history }) => ({ amp: app && app.amp, history }))
export default class AnalyticsProvider extends Component {
  static propTypes = {
    /**
     * Function which should return desired analytics targets to configure.
     */
    targets: PropTypes.func.isRequired,

    /**
     * Set to true to delay loading of analytics until the app is interactive
     */
    delayUntilInteractive: PropTypes.bool,

    /**
     * Delays loading analytics for a number of milliseconds
     */
    delay: PropTypes.number
  }

  constructor(props) {
    super(props)
    // Configure analytics for server side AMP rendering
    if (props.targets && props.amp) {
      configureAnalytics(...props.targets(false))
    }
  }

  /**
   * Returns true unless a rsf_disable_analytics cookie is present and set to "true".
   * This cookie allows us to turn off analytics during smoke testing, crawling, etc...
   * @return {Boolean}
   */
  anayticsEnabled() {
    return getCookie('rsf_disable_analytics') !== 'true'
  }

  async componentDidMount() {
    const { delayUntilInteractive, delay } = this.props

    if (this.props.targets) {
      if (delayUntilInteractive) {
        await ttiPolyfill.getFirstConsistentlyInteractive()
      }

      if (delay) {
        await sleep(delay)
      }

      if (this.anayticsEnabled()) {
        if (process.env.NODE_ENV === 'development') {
          console.log('[AnalyticsProvider]', 'initializing analytics')
        }

        const targets = this.props.targets()
        configureAnalytics(...targets)

        for (let target of targets) {
          if (typeof target.setHistory === 'function') {
            target.setHistory(this.props.history)
          }
        }

        activate()
      } else {
        console.log('Skipping analytics because a rsf_disable_analytics=true cookie is present.')
      }
    }
  }

  render() {
    return <Provider analytics={analytics}>{this.props.children}</Provider>
  }
}

function sleep(time) {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time)
  })
}
