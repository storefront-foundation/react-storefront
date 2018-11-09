/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import UpdateNotification from '../src/UpdateNotification'
import TestProvider from './TestProvider'

describe('UpdateNotification', () => {
  beforeEach(function(){
    jest.spyOn(global.console, 'log').mockImplementation()
  })

  it('should render without any props', () => {
    expect(
      mount(<TestProvider><UpdateNotification/></TestProvider>)
    ).toMatchSnapshot()
  })

  it('should accept a custom message', () => {
    const wrapper = mount(<TestProvider><UpdateNotification message="Update available"/></TestProvider>)

    return new Promise((resolve, reject) => {
      document.dispatchEvent(new CustomEvent('moov-update-available'))
      requestAnimationFrame(() => {
        expect(wrapper.update()).toMatchSnapshot()
        resolve()
      })
    })
  })

  it('should accept custom text for the reload button', () => {
    const wrapper = mount(<TestProvider><UpdateNotification reloadButtonText="REFRESH"/></TestProvider>)

    return new Promise((resolve, reject) => {
      document.dispatchEvent(new CustomEvent('moov-update-available'))
      requestAnimationFrame(() => {
        expect(wrapper.update()).toMatchSnapshot()
        resolve()
      })
    })
  })

  it('should show when moov-update-available is dispatched', () => {
    const wrapper = mount(<TestProvider><UpdateNotification/></TestProvider>)

    return new Promise((resolve, reject) => {
      document.dispatchEvent(new CustomEvent('moov-update-available'))
      requestAnimationFrame(() => {
        expect(wrapper.update()).toMatchSnapshot()
        resolve()
      })
    })
  })
})