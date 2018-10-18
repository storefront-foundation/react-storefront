/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Row from '../src/Row'

describe('Row', () => {

  it('renders with no props', () => {
    const component = (
      <Row/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a className prop', () => {
    const component = (
      <Row className="myClassName"/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a root class', () => {
    const component = (
      <Row classes={{ root: 'myRootClass' }}/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('spreads props to the underlying div', () => {
    const component = (
      <Row style={{ backgroundColor: 'red' }}/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
  
})