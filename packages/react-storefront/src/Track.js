/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { inject } from 'mobx-react'
import PropTypes from 'prop-types'
import analytics, { getTargets } from './analytics'

let nextId = 0
let ampAnalyticsTypes = {}

/**
 * @private
 * Used to reset the id for repeatable test results.
 */
export function resetId() {
  nextId = 0 
}

/**
 * Fires an analytics event when the user interacts with the child component.  By default this fires when the user
 * clicks on the child component, but this can be overriden using the `trigger` prop.  The value of trigger should
 * be the name of the event prop to bind to. All additional props will be passed as options along with the event.
 * 
 * Example:
 * 
 * <Track event="addedToCart" product={this.props.product}>
 *  <Button>Add to Cart</Button>
 * </Track>
 */
@inject('app')
export default class Track extends Component {
  
  constructor() {
    super()
    this.id = (nextId++).toString()
  }

  static propTypes = {
    /**
     * The name of the method to call on all configured analytics targets.
     * For example, "addedToCart".
     */
    event: PropTypes.string.isRequired,

    /**
     * The name of the handler prop on child component to intercept.  Defaults to "onClick"
     */
    trigger: PropTypes.string,

    /**
     * A function to call once the event has been successfully sent by all analytics targets.
     */
    onSuccess: PropTypes.func,

    /**
     * Additional data to send when tracking events in AMP.
     */
    ampData: PropTypes.object
  }

  static defaultProps = {
    trigger: 'onClick',
    onSuccess: Function.prototype,
    ampData: {}
  }

  componentWillMount() {
    if (this.props.app.amp) {
      const { event, trigger, app, children, onSuccess, ...data } = this.props
      this.createAmpTriggers(data)
    }
  }

  render() {
    return this.attachEvent()
  }

  /**
   * Fires the analytics event asynchronously using setImmediate so as not to 
   * block the render loop.
   */
  fireEvent() {
    const { event, trigger, app, children, onSuccess, ampData, ...data } = this.props

    setImmediate(async () => {
      await analytics.fire(event, data)
      onSuccess()
    })
  }

  /**
   * Intecepts the child's event handler prop corresponding to this.props.trigger
   * and returns the cloned child.
   * @return {React.Element}
   */
  attachEvent() {
    const { app: { amp }, trigger, children: el } = this.props

    if (el) {
      let originalHandler = el.props[trigger]

      const props = {
        ...el.props,
        [trigger]: (...args) => {
          if (originalHandler) originalHandler(...args)
          this.fireEvent()
        }
      }
  
      if (amp) {
        props['data-amp-id'] = this.id
        props['data-vars-moov-test'] = 'foo'
      }
  
      return React.cloneElement(el, props)
    } else {
      return null
    }
  }

  /**
   * Creates AMP event trigger objects based on this.props.event
   */
  createAmpTriggers(data) {
    const { event, children, ampData } = this.props

    for (let target of getTargets()) {
      const handler = target[event]
      const type = target.getAmpAnalyticsType()

      if (handler && type) {
        let eventData

        // Override send to capture the data that would be send instead of trying to send it
        target.send = data => eventData = data

        // Call the method corresponding to the event name, this should result in a call to send
        handler.call(target, data)

        if (eventData) {
          if (!eventData.trigger && children) {
            // no need to set a selector if we don't have a child element
            // an example of this is pageview events
            eventData.selector = `[data-amp-id="${this.id}"]`
          }
  
          this.configureAmpEvent(type, {
            on: eventData.selector ? 'click' : 'visible',
            ...eventData,
            request: 'event',
            ...ampData
          })
        } else {
          console.log(`WARNING: No data will be sent for the ${event} event when running in AMP because ${target.constructor.name} didn't return any data for this event.`)
        }
      }
    }
  }

  /**
   * Adds an AMP analytics event trigger
   * @param {String} type An AMP analytics event type, e.g. googleanalytics
   * @param {Object} trigger The trigger descriptor object
   */
  configureAmpEvent(type, trigger) {
    let config = ampAnalyticsTypes[type]

    if (!config) {
      config = ampAnalyticsTypes[type] = {
        triggers: []
      }
    }

    config.triggers.push(trigger)
  }

}

export function renderAmpAnalyticsTags() {
  const result = []

  for (let type in ampAnalyticsTypes) {
    result.push(
      `<amp-analytics${type === 'gtm' ? '' : ` type="${type}"`}>` +
        `<script type="application/json">${JSON.stringify(ampAnalyticsTypes[type])}</script>` +
      `</amp-analytics>`
    )
  }
  
  ampAnalyticsTypes = {}

  return result.join('\n')
}