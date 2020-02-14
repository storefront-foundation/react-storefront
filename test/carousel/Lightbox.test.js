import React from 'react'
import { mount } from 'enzyme'
import Lightbox from 'react-storefront/carousel/Lightbox'

describe('Lightbox', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component', () => {
    wrapper = mount(
      <Lightbox open>
        <div id="test">test</div>
      </Lightbox>,
    )

    expect(wrapper.find('#test').text()).toBe('test')
  })
})
