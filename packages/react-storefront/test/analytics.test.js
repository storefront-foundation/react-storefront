/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import analytics, { configureAnalytics, getTargets } from '../src/analytics'

describe('AnalyticsProvider', () => {
  it('calls all targets', () => {
    const targets = [1, 2, 3].map(i => ({ testMethod: jest.fn() }))

    configureAnalytics(...targets)
    const data = { search: { keywords: 'red shirt' } }
    analytics.testMethod(data)

    targets.forEach(target => {
      expect(target.testMethod).toHaveBeenCalledWith(data)
    })
  })

  it('supports fire(event, ...params)', () => {
    const targets = [1, 2, 3].map(i => ({ testMethod: jest.fn() }))

    configureAnalytics(...targets)
    const data = { search: { keywords: 'red shirt' } }
    analytics.fire('testMethod', data)

    targets.forEach(target => {
      expect(target.testMethod).toHaveBeenCalledWith(data)
    })
  })

  it('displays a warning when a target does not support a method', () => {
    jest.spyOn(global.console, 'warn')
    const target = {}
    configureAnalytics(target)
    analytics.fooPageView({})
    expect(console.warn).toBeCalled()
  })

  it('should return all targets', () => {
    const t1 = {}
    const t2 = {}

    configureAnalytics(t1, t2)

    const [r1, r2, ...rest] = getTargets()
    expect(r1).toBe(t1)
    expect(r2).toBe(t2)
    expect(rest.length).toBe(0)
  })

  it('should return AnalyticsProxy from toString()', () => {
    configureAnalytics({})
    expect(analytics.toString()).toBe('AnalyticsProxy')
  })
})
