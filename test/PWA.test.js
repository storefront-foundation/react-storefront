import React from 'react'
import { mount } from 'enzyme'
import PWA from 'react-storefront/PWA'

describe('PWA', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <PWA>
        <div id="test">test</div>
      </PWA>,
    )

    expect(wrapper.find('#test')).toExist()
  })
})
