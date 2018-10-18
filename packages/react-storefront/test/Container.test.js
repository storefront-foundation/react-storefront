/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { create } from 'react-test-renderer'
import { mount } from 'enzyme'
import Container from '../src/Container'

describe('Container', () => {

  it('renders with no props', () => {
    const component = (
      <Container/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('accepts a className prop', () => {
    const component = (
      <Container className="myClassName"/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('accepts a root class', () => {
    const component = (
      <Container classes={{ root: 'myRootClass' }}/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('spreads props to the underlying div', () => {
    const component = (
      <Container style={{ backgroundColor: 'red' }}/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })
  
})