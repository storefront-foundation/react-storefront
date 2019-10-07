import React from 'react'
import { mount } from 'enzyme'
import VisibilitySensor from '../src/VisibilitySensor'
import TestProvider from './TestProvider'
import ReactVisibilitySensor from 'react-visibility-sensor'

describe('VisibilitySensor', () => {
  it('active should be true by default', () => {
    const wrapper = mount(
      <TestProvider app={{ _navigation: { scrollResetPending: false } }}>
        <VisibilitySensor active />
      </TestProvider>
    )
    expect(wrapper.find(ReactVisibilitySensor).props().active).toBe(true)
  })

  it('should be be inactive when app._navigation.scrollResetPending is true', () => {
    const wrapper = mount(
      <TestProvider app={{ _navigation: { scrollResetPending: true } }}>
        <VisibilitySensor active />
      </TestProvider>
    )
    expect(wrapper.find(ReactVisibilitySensor).props().active).toBe(false)
  })
})
