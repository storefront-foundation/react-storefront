/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ActionButton from '../src/ActionButton'

describe('ActionButton', () => {

  it('renders with no props', () => {
    const component = (
      <ActionButton/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('renders label and value', () => {
    const component = (
      <ActionButton label="Label" value="Value"/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
  
})