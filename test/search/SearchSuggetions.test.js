import React from 'react'
import { mount } from 'enzyme'
import SearchSuggestions from 'react-storefront/search/SearchSuggestions'
import SearchSuggestionGroup from 'react-storefront/search/SearchSuggestionGroup'
import SearchContext from 'react-storefront/search/SearchContext'
import LoadMask from 'react-storefront//LoadMask'

describe('SearchSuggestions', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render LoadMask when loading', () => {
    wrapper = mount(
      <SearchContext.Provider value={{ state: { loading: true } }}>
        <SearchSuggestions />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(LoadMask).prop('show')).toBe(true)
  })

  it('should render custom children when render prop provided', () => {
    wrapper = mount(
      <SearchContext.Provider value={{ state: { groups: 'testContent' } }}>
        <SearchSuggestions render={state => <div id="test">{state.groups}</div>} />
      </SearchContext.Provider>,
    )

    expect(wrapper.find('#test').text()).toBe('testContent')
  })

  it('should render search suggestion groups', () => {
    wrapper = mount(
      <SearchContext.Provider
        value={{
          state: {
            groups: [
              { links: [], caption: '' },
              { links: [], caption: '' },
            ],
            loading: false,
          },
        }}
      >
        <SearchSuggestions />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(SearchSuggestionGroup).length).toBe(2)
    expect(wrapper.find(LoadMask).prop('show')).toBe(false)
  })
})
