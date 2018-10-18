/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ToolbarButton from '../src/ToolbarButton'

describe('ToolbarButton', () => {
  it('should render icon and button', () => {
    expect(
      mount(
        <ToolbarButton icon={<div>icon here</div>} label="menu"/>
      )
    ).toMatchSnapshot()
  })

  it('should render additional children inside the button', () => {
    expect(
      mount(
        <ToolbarButton icon={<div>icon here</div>} label="menu">
          <div>additional child</div>
        </ToolbarButton>
      )
    ).toMatchSnapshot()
  })
})