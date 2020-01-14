import React from 'react'
import { mount } from 'enzyme'
import SearchButton from 'react-storefront/search/SearchButton'
import { Search } from '@material-ui/icons'
import { IconButton } from '@material-ui/core'

describe('SearchButton', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <SearchButton>
        <div id="test" />
      </SearchButton>,
    )

    expect(wrapper.find('#test')).toExist()
  })

  it('should render search icon when children not passed', () => {
    wrapper = mount(<SearchButton />)

    expect(wrapper.find(Search)).toExist()
  })
  it('should spread props on button', () => {
    wrapper = mount(<SearchButton spreadprops="test" />)

    expect(wrapper.find(IconButton).prop('spreadprops')).toBe('test')
  })
})
