/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import LoadMask from '../src/LoadMask'

describe('LoadMask', () => {
  it('should render without children', () => {
    expect(mount(<LoadMask/>)).toMatchSnapshot()
  })

  it('should render with children', () => {
    expect(mount(<LoadMask>Loading...</LoadMask>)).toMatchSnapshot()
  })

  it('should set overflow to hidden when fullscreen==true', () => {
    const wrapper = mount(<LoadMask show fullscreen/>)
    expect(document.body.style.overflow).toBe('hidden')
    wrapper.unmount()
    expect(document.body.style.overflow).toBe('visible')
  })
})