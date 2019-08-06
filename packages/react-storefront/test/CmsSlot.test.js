/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import CmsSlot from '../src/CmsSlot'
import * as util from '../src/utils/lazyLoadImages'

describe('CmsSlot', () => {
  it('renders verbatim html', () => {
    const component = <CmsSlot className="slot1">{`<p>Content Here</p>`}</CmsSlot>

    expect(mount(component)).toMatchSnapshot()
  })

  it('renders nothing when no children are provided', () => {
    const component = <CmsSlot />

    expect(mount(component)).toMatchSnapshot()
  })

  it('passes onClick through to the underlying span', () => {
    const handler = jest.fn()

    mount(<CmsSlot onClick={handler}>{`Test`}</CmsSlot>).simulate('click')

    expect(handler).toHaveBeenCalled()
  })

  it('eager load lazy image source when InteractionObserver does not exist', () => {
    const wrapper = mount(
      <CmsSlot lazyLoadImages>
        {`
        <img data-src="foo" data-rsf-lazy>
        <img data-src="bar" data-rsf-lazy>
        `}
      </CmsSlot>
    )

    expect(wrapper.html()).toContain(' src="foo"')
    expect(wrapper.html()).toContain(' src="bar"')
  })

  it('lazy load images after prop has been updated', () => {
    const wrapper = mount(
      <CmsSlot lazyLoadImages>
        {`
        <img data-src="foo" data-rsf-lazy>
        <img data-src="bar" data-rsf-lazy>
        `}
      </CmsSlot>
    )

    const spy = jest.spyOn(util, 'lazyLoadImages')

    wrapper.setProps({
      children: `
      <img data-src="a" data-rsf-lazy>
      <img data-src="b" data-rsf-lazy>
      <img data-src="c" data-rsf-lazy>
    `
    })

    expect(spy).toBeCalledTimes(1)

    spy.mockRestore()
  })
})
