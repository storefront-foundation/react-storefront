/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { create } from 'react-test-renderer'
import { mount } from 'enzyme'
import Box, { Vbox, Hbox } from '../src/Box'

describe('Box', () => {

  it('renders with no props', () => {
    const component = (
      <Box/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })
  
  it('fowards props to style', () => {
    const component = (
      <Box 
        height="100%" 
        width="100%"
      />
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })


  it('accepts css', () => {
    const component = (
      <Box 
        className="myClass" 
        classes={{ root: 'rootClass' }} 
      />
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })
})

describe('Vbox', () => {
  it('renders', () => {
    expect(create(<Vbox/>).toJSON()).toMatchSnapshot()
  })
})

describe('Hbox', () => {
  it('renders', () => {
    expect(create(<Hbox/>).toJSON()).toMatchSnapshot()
  })
})