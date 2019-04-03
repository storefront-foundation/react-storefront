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
      </AnalyticsProvider>
    )
    expect(spy).toHaveBeenCalledWith(1, 2, 3)
    spy.mockRestore()
  })

  it('should render given children', () => {
    const wrapper = mount(
      <AnalyticsProvider targets={() => []}>
        <div className="hello">Hello</div>
      </AnalyticsProvider>
    )
    expect(wrapper.find('.hello').text()).toEqual('Hello')
  })

  it('should configure targets on the server when rendering amp', () => {
    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <AnalyticsProvider targets={() => []}>
          <div className="hello">Hello</div>
        </AnalyticsProvider>
      </TestProvider>
    )
    expect(wrapper.find('.hello').text()).toEqual('Hello')
  })
  
})