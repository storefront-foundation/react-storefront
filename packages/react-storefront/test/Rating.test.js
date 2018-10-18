/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Rating from '../src/Rating'

describe('Rating', () => {

  it('renders 0', () => {
    const component = <Rating value={0}/>
    expect(mount(component)).toMatchSnapshot()
  })

  it('renders 5', () => {
    const component = <Rating value={5}/>
    expect(mount(component)).toMatchSnapshot()
  })

  it('should display half stars', () => {
    const component = <Rating value={3.5}/>
    expect(mount(component)).toMatchSnapshot()
  })

  it('renders null', () => {
    const component = <Rating value={null}/>
    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts a custom label', () => {
    const component = (
      <Rating 
        value={2} 
        reviewCount={10} 
        label={count => (<span>customers reviewed this product</span>)}
      />
    )

    expect(mount(component)).toMatchSnapshot()
  })
})