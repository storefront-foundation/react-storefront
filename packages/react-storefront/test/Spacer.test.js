/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Spacer from '../src/Spacer'

describe('Spacer', () => {
  it('renders', () => {
    const component = <Spacer />
    expect(mount(component)).toMatchSnapshot()
  })
})
