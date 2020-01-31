import React from 'react'
import { mount } from 'enzyme'
import SEOLinks from 'react-storefront/menu/SEOLinks'

describe('SEOLinks', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render links in nav', () => {
    wrapper = mount(
      <SEOLinks
        root={{
          items: [
            {
              href: '/',
              text: 'foo',
            },
            {
              text: 'bar',
            },
          ],
        }}
      />,
    )
    expect(wrapper.text()).toBe('foo')
  })
})
