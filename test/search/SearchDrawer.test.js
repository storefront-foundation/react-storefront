import React from 'react'
import { mount } from 'enzyme'
import SearchDrawer from 'react-storefront/search/SearchDrawer'

describe('SearchDrawer', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <SearchDrawer open onClose={() => null}>
        <div id="test" />
      </SearchDrawer>,
    )

    expect(wrapper.find('#test')).toExist()
  })
})
