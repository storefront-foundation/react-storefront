import React from 'react'
import { mount } from 'enzyme'
import MenuButton from 'react-storefront/menu/MenuButton'

describe('Fill', () => {
  let wrapper

  afterEach(() => {
    if (wrapper.exists()) {
      wrapper.unmount()
    }
  })

  it('should render icon in menu button', () => {
    wrapper = mount(<MenuButton open={false} />)
    expect(wrapper.find('MenuIcon').prop('open')).toEqual(false)
  })
})
