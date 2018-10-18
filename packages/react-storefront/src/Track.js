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
 * Fires an analytic event when the user interacts with the child component.  By default this fires when the user
 * clicks on the child component, but this can be overriden using the `trigger` prop.  The value of trigger should
 * be the name of the prop on
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
    trigger: PropTypes.string
  }

  static defaultProps = {
    trigger: 'onClick'
  }

  componentWillMount() {
    if (this.props.app.amp) {
      const { event, trigger, app, children, ...data } = this.props
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
    const { event, trigger, app, children, ...data } = this.props
    setImmediate(() => analytics[event](data))
  }

  /**
   * Intecepts the child's event handler prop corresponding to this.props.trigger
   * and returns the cloned child.
   * @return {React.Element}
   */
  attachEvent() {
    const { app: { amp }, trigger, children: el } = this.props
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
  }

  /**
   * Creates AMP event trigger objects based on this.props.event
   */
  createAmpTriggers(data) {
    const { event } = this.props

    for (let target of getTargets()) {
      const props = target.getPropsForAmpAnalytics(event, data)

      if (props) {
        this.configureAmpEvent(target.getAmpAnalyticsType(), {
          on: 'click',
          selector: `[data-amp-id="${this.id}"]`,
          ...props
        })
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
      `<amp-analytics type="${type}">` +
        `<script type="application/json">${JSON.stringify(ampAnalyticsTypes[type])}</script>` +
      `</amp-analytics>`
    )
  }
  
  ampAnalyticsTypes = {}

  return result.join('\n')
}