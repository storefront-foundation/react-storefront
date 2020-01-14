/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ToolbarButton from 'react-storefront/ToolbarButton'
import { IconButton } from '@material-ui/core'

describe('ToolbarButton', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the component', () => {
    wrapper = mount(<ToolbarButton />)
    expect(wrapper.exists()).toBe(true)
  })

  it('should accept children', () => {
    const Child = () => <h1>Child</h1>

    wrapper = mount(
      <ToolbarButton>
        <Child />
      </ToolbarButton>,
    )
    expect(wrapper.find(Child).text()).toBe('Child')
  })

  it('should accept label and icon', () => {
    const Label = () => <h1>Label</h1>
    const Icon = () => <h1>Icon</h1>

    wrapper = mount(
      <ToolbarButton>
        <Label />
        <Icon />
      </ToolbarButton>,
    )
    expect(wrapper.find(Label).text()).toBe('Label')
    expect(wrapper.find(Icon).text()).toBe('Icon')
  })

  it('should pass spreaded props', () => {
    wrapper = mount(<ToolbarButton testprops="test" />)
    expect(wrapper.find(IconButton).prop('testprops')).toBe('test')
  })

  it('should pass classes to button', () => {
    const classes = { root: 'test' }

    wrapper = mount(<ToolbarButton classes={classes} />)
    expect(wrapper.find(IconButton).prop('classes')).toStrictEqual(classes)
  })
})
