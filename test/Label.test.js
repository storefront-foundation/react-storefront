import React from 'react'
import { mount } from 'enzyme'
import Label from 'react-storefront/Label'
import { Typography } from '@material-ui/core'

describe('Label', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should be able to spread props', () => {
    wrapper = mount(<Label testprop="testprop" />)

    expect(wrapper.find(Typography).prop('testprop')).toBe('testprop')
  })
})
