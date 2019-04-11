/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import AmpHidden from '../../src/amp/AmpHidden'

describe('AmpHidden', () => {
  it('should render visible by default', () => {
    expect(mount(<AmpHidden bind="myState.hidden" />)).toMatchSnapshot()
  })

  it('should render hidden initially when hidden=true', () => {
    expect(mount(<AmpHidden bind="myState.hidden" hidden />)).toMatchSnapshot()
  })
})
