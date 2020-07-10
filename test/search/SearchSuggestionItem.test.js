import React from 'react'
import { mount } from 'enzyme'
import SearchProvider from 'react-storefront/search/SearchProvider'
import SearchSuggestionItem from 'react-storefront/search/SearchSuggestionItem'
import Image from 'react-storefront/Image'
import PWAContext from 'react-storefront/PWAContext'

describe('SearchSuggestionItem', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children when provided', () => {
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <SearchProvider>
          <SearchSuggestionItem item={{ href: '/test' }}>
            <div id="child">child</div>
          </SearchSuggestionItem>
        </SearchProvider>
      </PWAContext.Provider>,
    )

    expect(wrapper.find('#child').text()).toBe('child')
  })

  it('should render image with a text when no children provided', () => {
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <SearchProvider>
          <SearchSuggestionItem item={{ href: '/test', text: 'test' }} />
        </SearchProvider>
      </PWAContext.Provider>,
    )

    expect(wrapper.find(Image)).toExist()
    expect(
      wrapper
        .find('div')
        .first()
        .text(),
    ).toBe('test')
  })

  it('should spread thumbnail props on image', () => {
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <SearchProvider>
          <SearchSuggestionItem
            item={{ href: '/test', thumbnail: { testprop2: 'test2' } }}
            thumbnailProps={{ testprop1: 'test1' }}
          />
        </SearchProvider>
      </PWAContext.Provider>,
    )

    expect(wrapper.find(Image).prop('testprop1')).toBe('test1')
    expect(wrapper.find(Image).prop('testprop2')).toBe('test2')
  })
})
