import React from 'react'
import { mount } from 'enzyme'
import Offline from 'react-storefront/Offline'
import { CloudOff as CloseOffIcon, ArrowBack as Test } from '@mui/icons-material'
import { Typography } from '@mui/material'

describe('Offline', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component with default props', () => {
    wrapper = mount(<Offline />)

    expect(wrapper.find(CloseOffIcon).exists()).toBe(true)
    expect(
      wrapper
        .find(Typography)
        .first()
        .text(),
    ).toBe("You're offline")
    expect(
      wrapper
        .find(Typography)
        .last()
        .text(),
    ).toBe('Please check your internet connection')
  })

  it('should allow default heading', () => {
    wrapper = mount(<Offline heading="test" />)

    expect(
      wrapper
        .find(Typography)
        .first()
        .text(),
    ).toBe('test')
  })

  it('should allow default message', () => {
    wrapper = mount(<Offline message="test" />)

    expect(
      wrapper
        .find(Typography)
        .last()
        .text(),
    ).toBe('test')
  })

  it('should allow default icon', () => {
    wrapper = mount(<Offline Icon={() => <Test />} />)

    expect(wrapper.find(Test).exists()).toBe(true)
  })
})
