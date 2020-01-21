import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import FacetGroup from 'react-storefront/plp/FacetGroup'
import Filter from 'react-storefront/plp/Filter'

describe('Filter', () => {
  let wrapper

  const facets = [
    {
      name: 'Size',
      ui: 'buttons',
      options: [
        { name: 'SM', code: 'size:sm' },
        { name: 'MD', code: 'size:md' },
        { name: 'LG', code: 'size:lg' },
        { name: 'XL', code: 'size:xl' },
        { name: 'XXL', code: 'size:xxl' },
      ],
    },
    {
      name: 'Colors',
      ui: 'buttons',
      options: [
        { name: 'SM', code: 'size:sm' },
        { name: 'MD', code: 'size:md' },
        { name: 'LG', code: 'size:lg' },
        { name: 'XL', code: 'size:xl' },
        { name: 'XXL', code: 'size:xxl' },
      ],
    },
  ]

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render as many facet groups as there are facets', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            facets,
          },
        }}
      >
        <Filter />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(FacetGroup).length).toBe(2)
  })
})
