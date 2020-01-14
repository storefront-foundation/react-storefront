import React from 'react'
import { mount } from 'enzyme'
import Spacer from 'react-storefront/Spacer'

describe('Spacer', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component', () => {
    wrapper = mount(<Spacer />)

    expect(wrapper.find(Spacer).exists()).toBe(true)
  })
})
