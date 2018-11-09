/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import QuantitySelector from '../src/QuantitySelector'
import { mount } from 'enzyme'
import { Provider } from "mobx-react"
import AppModelBase from '../src/model/AppModelBase'

describe('QuantitySelector', () => {

  let app

  beforeEach(() => {
    app = AppModelBase.create
  })

  it('renders', () => {
    const component = (
      <Provider app={app}>
        <QuantitySelector/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('should accept a value', () => {
    const component = (
      <Provider app={app}>
        <QuantitySelector value={2}/>
      </Provider>
    )
    expect(mount(component)).toMatchSnapshot()
  })

  it('should decrement when the minus button is clicked', () => {
    const onChange = jest.fn()

    mount(
      <Provider app={app}>
        <QuantitySelector value={2} onChange={onChange}/>
      </Provider>
    )
      .find('button').at(0)
      .simulate('click')

    expect(onChange).toBeCalledWith(1)
  })

  it('should enforce the minValue', () => {
    const onChange = jest.fn()

    mount(
      <Provider app={app}>
        <QuantitySelector value={0} minValue={0} onChange={onChange}/>
      </Provider>
    )
      .find('button').at(0)
      .simulate('click')

    expect(onChange).not.toBeCalled()
  })

  it('should enforce the maxValue', () => {
    const onChange = jest.fn()

    mount(
      <Provider app={app}>
        <QuantitySelector value={10} maxValue={10} onChange={onChange}/>
      </Provider>
    )
      .find('button').at(1)
      .simulate('click')

    expect(onChange).not.toBeCalled()
  })

  it('should increment when the plus button is clicked', () => {
    const onChange = jest.fn()
    
    mount(
      <Provider app={app}>
        <QuantitySelector value={1} onChange={onChange}/>
      </Provider>
    )
      .find('button').at(1)
      .simulate('click')

    expect(onChange).toBeCalledWith(2)
  })

})