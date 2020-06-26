import React from 'react'
import { mount } from 'enzyme'
import SearchSuggestionGroup from 'react-storefront/search/SearchSuggestionGroup'
import SearchSuggestionItem from 'react-storefront/search/SearchSuggestionItem'
import SearchProvider from 'react-storefront/search/SearchProvider'
import PWAContext from 'react-storefront/PWAContext'

describe('SearchSuggestionGroup', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children when provided', () => {
    wrapper = mount(
      <SearchProvider>
        <SearchSuggestionGroup caption="">
          <div id="child">child</div>
        </SearchSuggestionGroup>
      </SearchProvider>,
    )

    expect(wrapper.find('#child').text()).toBe('child')
  })

  it('should render suggested items when no children provided', () => {
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <SearchProvider>
          <SearchSuggestionGroup caption="" links={[{ href: '/test1' }, { href: '/test2' }]} />
        </SearchProvider>
      </PWAContext.Provider>,
    )

    expect(wrapper.find(SearchSuggestionItem).length).toBe(2)
  })

  it('should render provided caption', () => {
    wrapper = mount(
      <SearchProvider>
        <SearchSuggestionGroup links={[]} caption="test" />
      </SearchProvider>,
    )

    expect(wrapper.find(SearchSuggestionGroup).text()).toBe('test')
  })
})
