import React from 'react'
import TestProvider from './TestProvider'
import Lazy from '../src/Lazy'
import { mount } from 'enzyme'

describe('Lazy', () => {
  it('should be lazy when rendering PWA', () => {
    const wrapper = mount(
      <TestProvider>
        <Lazy>
          <div id="target">foo</div>
        </Lazy>
      </TestProvider>
    )

    expect(wrapper.exists('#target')).toBe(false)
  })

  it('should not be lazy when rendering AMP', () => {
    const wrapper = mount(
      <TestProvider app={{ amp: true }}>
        <Lazy>
          <div id="target">foo</div>
        </Lazy>
      </TestProvider>
    )

    expect(wrapper.exists('#target')).toBe(true)
  })
})
