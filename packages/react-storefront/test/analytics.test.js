/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import analytics, { configureAnalytics, getTargets, activate } from '../src/analytics'

describe('analytics', () => {
  it('calls all targets', () => {
    const targets = [1, 2, 3].map(i => ({ testMethod: jest.fn() }))

    configureAnalytics(...targets)
    activate()
    const data = { search: { keywords: 'red shirt' } }
    analytics.testMethod(data)

    targets.forEach(target => {
      expect(target.testMethod).toHaveBeenCalledWith(data)
    })
  })

  it('supports fire(event, ...params)', () => {
    const targets = [1, 2, 3].map(i => ({ testMethod: jest.fn() }))

    configureAnalytics(...targets)
    activate()
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
    activate()
    analytics.fooPageView({})
    expect(console.warn).toBeCalled()
  })

  it('should return all targets', () => {
    const t1 = {}
    const t2 = {}

    configureAnalytics(t1, t2)
    activate()

    const [r1, r2, ...rest] = getTargets()
    expect(r1).toBe(t1)
    expect(r2).toBe(t2)
    expect(rest.length).toBe(0)
  })

  it('should return AnalyticsProxy from toString()', () => {
    configureAnalytics({})
    activate()
    expect(analytics.toString()).toBe('AnalyticsProxy')
  })

  it('should catch errors and allow other targets to be called', () => {
    const errorTarget = {
      test: jest.fn(() => { throw new Error('test')})
    }

    const successTarget = {
      test: jest.fn()
    }

    configureAnalytics(errorTarget, successTarget)
    activate()
    analytics.fire('test', {})
    expect(errorTarget.test).toHaveBeenCalled()
    expect(successTarget.test).toHaveBeenCalled()
  })

  it('should queue events until activates', () => {
    jest.resetModules()
    const { default: analytics, activate, configureAnalytics } = require('../src/analytics')
    analytics.fire('test', 'foo', 'bar')
    const test = jest.fn()
    configureAnalytics({ test })
    expect(test).not.toHaveBeenCalled()
    activate()
    expect(test).toHaveBeenCalledWith('foo', 'bar')
  })
})
