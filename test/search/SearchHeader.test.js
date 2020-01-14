import React from 'react'
import { mount } from 'enzyme'
import SearchHeader from 'react-storefront/search/SearchHeader'

describe('SearchHeader', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <SearchHeader>
        <div id="test">test</div>
      </SearchHeader>,
    )

    expect(wrapper.find('#test')).toExist()
  })
})
