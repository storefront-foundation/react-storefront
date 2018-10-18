/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { create } from 'react-test-renderer'
import { mount } from 'enzyme'
import Divider from '../src/Divider'

describe('Divider', () => {

  it('defaults to horizontal', () => {
    const component = (
      <Divider/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('renders a vertial divider', () => {
    const component = (
      <Divider vertical/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })
  
  it('renders a horizontal divider', () => {
    const component = (
      <Divider horizontal/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('accepts a className', () => {
    const component = (
      <Divider className="myClass"/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('passes styles to the underlying div', () => {
    const component = (
      <Divider style={{ color: 'red' }}/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })
})