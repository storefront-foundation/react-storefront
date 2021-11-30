import React from 'react'
import { mount } from 'enzyme'
import MenuItemContent from 'react-storefront/menu/MenuItemContent'
import MenuContext from 'react-storefront/menu/MenuContext'
import { CircularProgress } from '@mui/material'

describe('MenuItemContent', () => {
  let wrapper

  afterEach(() => {
    if (wrapper.exists()) {
      wrapper.unmount()
    }
  })

  const Test = ({ content, ...props }) => {
    return (
      <MenuContext.Provider
        value={{
          renderItemContent: () => content,
          onItemClick: () => 0,
          classes: {},
        }}
      >
        <MenuItemContent {...props} />
      </MenuContext.Provider>
    )
  }

  it('should render plain contents', () => {
    wrapper = mount(<Test content="hello" item={{}} />)
    expect(wrapper.text()).toBe('hello')
  })

  it('should render item with image', () => {
    wrapper = mount(<Test item={{ image: 'http:test.com/pic.jpg' }} />)
    expect(wrapper.find('img').length).toBe(1)
  })

  it('should render leaf item with image', () => {
    wrapper = mount(<Test leaf item={{ image: 'http:test.com/pic.jpg' }} />)
    expect(wrapper.find('img').length).toBe(1)
  })

  it('should render item loading', () => {
    wrapper = mount(<Test item={{ loading: true }} />)
    expect(wrapper.find(CircularProgress).length).toBe(1)
  })
})
