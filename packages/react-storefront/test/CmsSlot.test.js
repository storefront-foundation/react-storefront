/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { create } from 'react-test-renderer'
import { mount } from 'enzyme'
import CmsSlot from '../src/CmsSlot'

describe('CmsSlot', () => {

  it('renders verbatim html', () => {
    const component = (
      <CmsSlot className="slot1">
        {`<p>Content Here</p>`}
      </CmsSlot>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

  it('renders nothing when no children are provided', () => {
    const component = (
      <CmsSlot/>
    )

    expect(create(component).toJSON()).toMatchSnapshot()
  })

})