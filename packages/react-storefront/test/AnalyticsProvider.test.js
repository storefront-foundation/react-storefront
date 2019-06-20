/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import * as analytics from '../src/analytics'
import AnalyticsProvider from '../src/AnalyticsProvider'
import TestProvider from './TestProvider'

describe('AnalyticsProvider', () => {
  beforeEach(() => {
    window.__nativePromise = false
  })

  it('should call configure with targets', () => {
    const spy = jest.spyOn(analytics, 'configureAnalytics')
    mount(
      <AnalyticsProvider targets={() => [1, 2, 3]}>
        <div>Hello</div>
      </AnalyticsProvider>,
    )
    expect(spy).toHaveBeenCalledWith(1, 2, 3)
    spy.mockRestore()
  })

  it('should render given children', () => {
    const wrapper = mount(
      <AnalyticsProvider targets={() => []}>
        <div className="hello">Hello</div>
      </AnalyticsProvider>,
    )
    expect(wrapper.find('.hello').text()).toEqual('Hello')
  })

  it('should configure targets on the server when rendering amp', () => {
    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <AnalyticsProvider targets={() => []}>
          <div className="hello">Hello</div>
        </AnalyticsProvider>
      </TestProvider>,
    )
    expect(wrapper.find('.hello').text()).toEqual('Hello')
  })

  it('should call setHistory on all targets', () => {
    const target = { setHistory: jest.fn() }

    mount(
      <AnalyticsProvider targets={() => [target]}>
        <div className="hello">Hello</div>
      </AnalyticsProvider>,
    )

    expect(target.setHistory).toHaveBeenCalledTimes(1)
  })

  describe('delayUntilInteractive', () => {
    let setInteractive, env

    beforeEach(() => {
      env = process.env.NODE_ENV
      process.env.NODE_ENV = 'development' // for 100% coverage
      jest.resetModules()
      jest.mock('tti-polyfill', () => ({
        getFirstConsistentlyInteractive: () => new Promise((resolve, reject) => {
          setInteractive = resolve
        })
      }))
    })

    afterEach(() => {
      process.env.NODE_ENV = env
    })

    it('should not load targets until the app is interactive if delayUntilInteractive is true', (done) => {
      const AnalyticsProvider = require('../src/AnalyticsProvider').default
      const targets = jest.fn(() => [])

      mount(
        <AnalyticsProvider targets={targets} delayUntilInteractive>
          <div className="hello">Hello</div>
        </AnalyticsProvider>
      )

      expect(targets).not.toHaveBeenCalled()
      setInteractive()
      setImmediate(() => {
        expect(targets).toHaveBeenCalled()
        done()
      })
    })

    it('should load targets immediately if delayUntilInteractive is false', () => {
      const AnalyticsProvider = require('../src/AnalyticsProvider').default
      const targets = jest.fn(() => [])

      mount(
        <AnalyticsProvider targets={targets}>
          <div className="hello">Hello</div>
        </AnalyticsProvider>
      )

      expect(targets).toHaveBeenCalled()
    })
  })
})
