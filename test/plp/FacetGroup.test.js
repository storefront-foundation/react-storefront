import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import FacetGroup from 'react-storefront/plp/FacetGroup'
import CheckboxFilterGroup from 'react-storefront/plp/CheckboxFilterGroup'
import ButtonFilterGroup from 'react-storefront/plp/ButtonFilterGroup'
import ExpandableSection from 'react-storefront/ExpandableSection'

describe('FacetGroup', () => {
  let wrapper

  const group = {
    name: 'Size',
    ui: 'buttons',
    options: [
      { name: 'SM', code: 'size:sm' },
      { name: 'MD', code: 'size:md' },
      { name: 'LG', code: 'size:lg' },
      { name: 'XL', code: 'size:xl' },
      { name: 'XXL', code: 'size:xxl' },
    ],
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('should be emptry render when filters are undefined', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {},
        }}
      >
        <FacetGroup />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(FacetGroup).isEmptyRender()).toBe(true)
  })

  it('should render button filter group when ui prop is button', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: { filters: [] },
          actions: { toggleFilter: jest.fn() },
        }}
      >
        <FacetGroup group={group} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ButtonFilterGroup).exists()).toBe(true)
  })

  it('should render button checkbox filter group when ui prop is not button', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: { filters: [] },
          actions: { toggleFilter: jest.fn() },
        }}
      >
        <FacetGroup group={{ ...group, ui: '' }} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(CheckboxFilterGroup).exists()).toBe(true)
  })

  it('should show selected filter name when only 1 filter selected', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: { filters: ['size:sm'] },
          actions: { toggleFilter: jest.fn() },
        }}
      >
        <FacetGroup group={{ ...group, ui: '' }} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ExpandableSection).prop('caption')).toBe('SM')
  })

  it('should show how many filters selected as a number when more than 1', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: { filters: ['size:sm', 'size:md', 'size:lg'] },
          actions: { toggleFilter: jest.fn() },
        }}
      >
        <FacetGroup group={{ ...group, ui: '' }} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ExpandableSection).prop('caption')).toBe('3 selected')
  })
})
