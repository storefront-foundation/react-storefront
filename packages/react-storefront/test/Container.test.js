/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Container from '../src/Container'

describe('Container', () => {

  it('renders with no props', () => {
    const component = (
      <Container/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a className prop', () => {
    const component = (
      <Container className="myClassName"/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a root class', () => {
    const component = (
      <Container classes={{ root: 'myRootClass' }}/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('spreads props to the underlying div', () => {
    const component = (
      <Container style={{ backgroundColor: 'red' }}/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
  
})