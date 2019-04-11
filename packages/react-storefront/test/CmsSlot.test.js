/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import CmsSlot from '../src/CmsSlot'

describe('CmsSlot', () => {

  it('renders verbatim html', () => {
    const component = (
      <CmsSlot className="slot1">
        {`<p>Content Here</p>`}
      </CmsSlot>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('renders nothing when no children are provided', () => {
    const component = (
      <CmsSlot/>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('passes onClick through to the underlying span', () => {
    const handler = jest.fn()

    mount(<CmsSlot onClick={handler}>{`Test`}</CmsSlot>)
      .simulate('click')

    expect(handler).toHaveBeenCalled()
  })

})