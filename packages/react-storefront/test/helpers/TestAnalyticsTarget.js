/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import CommerceAnalyticsTarget from '../../src/analytics/CommerceAnalyticsTarget'
import { configureAnalytics } from '../../src/analytics'

export default class TestAnalyticsTarget extends CommerceAnalyticsTarget {
  events = []

  constructor() {
    super()
    this.sendForAllEvents({})
    configureAnalytics(this)
  }

  send(data) {
    this.events.push(data)
  }

  clear() {
    this.sent = []
  }
}
