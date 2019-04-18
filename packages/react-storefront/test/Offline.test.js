/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Offline from '../src/Offline'
import Icon from '@material-ui/icons/Close'

describe('Offline', () => {
  it('renders with no props', () => {
    const component = <Offline />
    expect(mount(component)).toMatchSnapshot()
  })

  it('accepts header, message, and Icon props', () => {
    const component = <Offline header="Header" message="Message" Icon={Icon} />
    expect(mount(component)).toMatchSnapshot()
  })
})
