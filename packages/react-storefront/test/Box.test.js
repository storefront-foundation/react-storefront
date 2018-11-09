/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Box, { Vbox, Hbox } from '../src/Box'

describe('Box', () => {

  it('renders with no props', () => {
    const component = (
      <Box/>
    )

    expect(mount(component)).toMatchSnapshot()
  })
  
  it('fowards props to style', () => {
    const component = (
      <Box 
        height="100%" 
        width="100%"
      />
    )

    expect(mount(component)).toMatchSnapshot()
  })


  it('accepts css', () => {
    const component = (
      <Box 
        className="myClass" 
        classes={{ root: 'rootClass' }} 
      />
    )

    expect(mount(component)).toMatchSnapshot()
  })
})

describe('Vbox', () => {
  it('renders', () => {
    expect(mount(<Vbox/>)).toMatchSnapshot()
  })
})

describe('Hbox', () => {
  it('renders', () => {
    expect(mount(<Hbox/>)).toMatchSnapshot()
  })
})