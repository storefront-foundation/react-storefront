import React from 'react'
import { mount } from 'enzyme'
import FilterHeader from 'react-storefront/plp/FilterHeader'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'

describe('FilterHeader', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render provided title', () => {
    const title = 'testTitle'

    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: [] }}>
        <FilterHeader title={title} />
      </SearchResultsContext.Provider>
    )

    expect(
      wrapper
        .find(FilterHeader)
        .childAt(0)
        .text()
    ).toBe(title)
  })

  it('should render provided clear Link text', () => {
    const clearLinkText = 'testClearLink'

    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: { filters: ['blue'] } }}>
        <FilterHeader clearLinkText={clearLinkText} />
      </SearchResultsContext.Provider>
    )

    expect(wrapper.find('button').text()).toBe(clearLinkText)
  })

  it('should hide clear link when hideClearLink prop provided', () => {
    wrapper = mount(
      <SearchResultsContext.Provider value={{ pageData: { filters: ['blue'] } }}>
        <FilterHeader hideClearLink />
      </SearchResultsContext.Provider>
    )

    expect(wrapper.find('button')).not.toExist()
  })

  it('should call clearFilters method on button click', () => {
    const clearSpy = jest.fn()

    wrapper = mount(
      <SearchResultsContext.Provider
        value={{ pageData: { filters: ['blue'] }, actions: { clearFilters: clearSpy } }}
      >
        <FilterHeader />
      </SearchResultsContext.Provider>
    )

    wrapper.find('button').simulate('click')

    expect(clearSpy).toHaveBeenCalled()
  })
})
