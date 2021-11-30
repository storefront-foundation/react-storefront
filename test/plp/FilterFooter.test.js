import React from 'react'
import { mount } from 'enzyme'
import FilterFooter from 'react-storefront/plp/FilterFooter'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import { Typography } from '@mui/material'

describe('FilterFooter', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should show how many filters selected', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{ pageData: { filters: ['blue'], filtersChanged: true } }}
      >
        <FilterFooter />
      </SearchResultsContext.Provider>
    )

    expect(
      wrapper
        .find(Typography)
        .first()
        .text()
    ).toBe('1 filter selected')
  })

  it('should say no filters selected, when filters are empty', () => {
    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: { filters: [], filtersChanged: true } }}>
        <FilterFooter />
      </SearchResultsContext.Provider>
    )

    expect(
      wrapper
        .find(Typography)
        .first()
        .text()
    ).toBe('No filters selected')
  })

  it('should be empty render when no filtersChanged', () => {
    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: { filters: [], filtersChanged: false } }}>
        <FilterFooter />
      </SearchResultsContext.Provider>
    )

    expect(wrapper.isEmptyRender()).toBe(true)
  })

  it('should be empty render when submitOnChange prop passed', () => {
    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: { filters: [], filtersChanged: true } }}>
        <FilterFooter submitOnChange />
      </SearchResultsContext.Provider>
    )

    expect(wrapper.isEmptyRender()).toBe(true)
  })
})
