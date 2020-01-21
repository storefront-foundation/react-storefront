import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import FilterButton from 'react-storefront/plp/FilterButton'
import Filter from 'react-storefront/plp/Filter'
import ActionButton from 'react-storefront/ActionButton'
import Drawer from 'react-storefront/drawer/Drawer'
import { act } from 'react-dom/test-utils'

describe('FilterButton', () => {
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
  ]

  afterEach(() => {
    wrapper.unmount()
  })

  beforeEach(() => {})

  it('should open drawer on filter click', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
            facets,
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(Filter)).not.toExist()
    wrapper.find(ActionButton).simulate('click')
    expect(wrapper.find(Filter)).toExist()
  })

  it('should trigger provided onClick fn on filter click', () => {
    const onClickSpy = jest.fn().mockImplementation(e => e.preventDefault())

    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
            facets,
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <FilterButton onClick={onClickSpy} />
      </SearchResultsContext.Provider>,
    )

    wrapper.find(ActionButton).simulate('click')
    expect(onClickSpy).toHaveBeenCalled()
  })

  it('should close drawer when clicked on view results', async () => {
    const applyFiltersSpy = jest.fn()

    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
            facets,
          },
          actions: {
            toggleFilter: jest.fn(),
            applyFilters: applyFiltersSpy,
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    await act(async () => {
      await wrapper.find(ActionButton).simulate('click')
      await wrapper.update()
      await wrapper.find(Filter).invoke('onViewResultsClick')()
      await wrapper.update()
    })

    expect(applyFiltersSpy).toHaveBeenCalled()
    expect(wrapper.find(Drawer).prop('open')).toBe(false)
  })

  it('should not provide sub label to button when no filters', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
            facets,
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ActionButton).prop('value')).toBe(null)
  })

  it('should provide filter name to sub label to button when one filter', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['size:sm'],
            facets,
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ActionButton).prop('value')).toBe('SM')
  })

  it('should provide sub label filter count to button when many filters', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['red', 'blue', 'black'],
            facets,
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ActionButton).prop('value')).toBe('3 selected')
  })

  it('should not provide sub label to button when unknown filter', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['red'],
            facets,
          },
        }}
      >
        <FilterButton />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(ActionButton).prop('value')).toBe(null)
  })
})
