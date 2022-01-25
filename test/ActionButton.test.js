import React from 'react'
import { mount } from 'enzyme'
import ActionButton from 'react-storefront/ActionButton'
import { Button, Typography } from '@mui/material'

describe('ActionButton', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should spread props to Button', () => {
    wrapper = mount(<ActionButton spreadprops="test" />)

    expect(wrapper.find(Button).prop('spreadprops')).toBe('test')
  })

  it('should spread classes to Button', () => {
    wrapper = mount(<ActionButton classes={{ root: 'test' }} />)

    expect(wrapper.find(Button).prop('classes').root).toBe('test')
  })

  it('should accept value and label as a string', () => {
    wrapper = mount(<ActionButton value="testValue" label="testLabel" />)

    expect(
      wrapper
        .find(Typography)
        .first()
        .text(),
    ).toBe('testLabel')

    expect(
      wrapper
        .find(Typography)
        .last()
        .text(),
    ).toBe('testValue')
  })

  it('should accept value and label as element', () => {
    wrapper = mount(<ActionButton value={<div>testValue</div>} label={<div>testLabel</div>} />)

    expect(
      wrapper
        .find(Typography)
        .first()
        .text(),
    ).toBe('testLabel')

    expect(
      wrapper
        .find(Typography)
        .last()
        .text(),
    ).toBe('testValue')
  })
})
