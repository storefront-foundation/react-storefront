/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Divider from '../src/Divider'

describe('Divider', () => {

  it('defaults to horizontal', () => {
    const component = (
      <Divider/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('renders a vertial divider', () => {
    const component = (
      <Divider vertical/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
  
  it('renders a horizontal divider', () => {
    const component = (
      <Divider horizontal/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a className', () => {
    const component = (
      <Divider className="myClass"/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('passes styles to the underlying div', () => {
    const component = (
      <Divider style={{ color: 'red' }}/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
})