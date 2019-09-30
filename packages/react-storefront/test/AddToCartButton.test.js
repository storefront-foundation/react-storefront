import React from 'react'
import { mount } from 'enzyme'
import TestProvider from './TestProvider'
import AddToCartButton from '../src/AddToCartButton'
import ProductModelBase from '../src/model/ProductModelBase'

describe('AddToCartButton', () => {
  it('should throttle clicks by 250ms by default', () => {
    const onClick = jest.fn()
    const product = ProductModelBase.create({ id: '1' })

    const wrapper = mount(
      <TestProvider>
        <AddToCartButton onClick={onClick} product={product} />
      </TestProvider>
    )

    const button = wrapper.find('AddToCartButton button').first()
    button.simulate('click')
    button.simulate('click')

    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('should allow you to turn throttling off', () => {
    const onClick = jest.fn()
    const product = ProductModelBase.create({ id: '1' })

    const wrapper = mount(
      <TestProvider>
        <AddToCartButton onClick={onClick} product={product} throttleClick={false} />
      </TestProvider>
    )

    const button = wrapper.find('AddToCartButton button').first()
    button.simulate('click')
    button.simulate('click')

    expect(onClick).toHaveBeenCalledTimes(2)
  })
})
