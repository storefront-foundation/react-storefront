/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Video from '../src/Video'
import Provider from './TestProvider'

describe('Video', () => {
  it('should render with video tag when in non-AMP mode', () => {
    expect(
      mount(
        <Provider app={{ amp: false }}>
          <Video src="haha.mp4" />
        </Provider>
      )
    ).toMatchSnapshot()
  })
  it('should render with amp-video in amp mode', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <Video src="haha.mp4" />
      </Provider>
    )
    expect(wrapper).toMatchSnapshot()
  })
  it('should use layout fill when not defined in amp mode', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <Video src="haha.mp4" />
      </Provider>
    )
    expect(wrapper.find('amp-video').prop('layout')).toBe('fill')
  })
  it('should use controls=true by default', () => {
    const wrapper = mount(
      <Provider app={{ amp: false }}>
        <Video src="haha.mp4" />
      </Provider>
    )
    expect(wrapper.find('video').prop('controls')).toBe(true)
  })
  it('should use class prop when in AMP mode', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <Video src="haha.mp4" />
      </Provider>
    )
    expect(wrapper.find('amp-video').props()).toHaveProperty('class')
  })
})
