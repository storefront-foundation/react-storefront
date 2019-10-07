/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import CheckoutButton from '../src/CheckoutButton'
import TestProvider from './TestProvider'
import { createMemoryHistory } from 'history'

describe('CheckoutButton', () => {
  it('renders', () => {
    const component = (
      <TestProvider>
        <CheckoutButton url="/checkout" />
      </TestProvider>
    )
    expect(mount(component)).toMatchSnapshot()
  })

  it('navigates via history when configured with a path', () => {
    const history = createMemoryHistory()
    history.push = jest.fn()

    const component = (
      <TestProvider history={history}>
        <CheckoutButton url="/checkout" />
      </TestProvider>
    )

    mount(component)
      .find('button')
      .simulate('click')

    expect(history.push).toHaveBeenCalledWith('/checkout', undefined)
  })

  it('navigates via window location change when configured with a full url', () => {
    const setter = jest.fn()
    const { location } = window

    try {
      delete window.location
      window.location = {}

      Object.defineProperty(window.location, 'href', {
        get: () => 'http://localhost',
        set: setter
      })

      const component = (
        <TestProvider history={history}>
          <CheckoutButton url="http://localhost/checkout" />
        </TestProvider>
      )

      mount(component)
        .find('button')
        .simulate('click')

      expect(setter).toHaveBeenCalledWith('http://localhost/checkout')
    } finally {
      window.location = location
    }
  })
})
