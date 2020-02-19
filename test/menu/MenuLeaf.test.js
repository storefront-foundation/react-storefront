import React from 'react'
import { mount } from 'enzyme'
import MenuItem from 'react-storefront/menu/MenuItem'
import Link from 'react-storefront/link/Link'
import MenuContext from 'react-storefront/menu/MenuContext'

describe('MenuItem', () => {
  let wrapper

  afterEach(() => {
    if (wrapper.exists()) {
      wrapper.unmount()
    }
  })

  const Test = ({ renderItem, ...props }) => {
    return (
      <MenuContext.Provider
        value={{
          renderItem,
          classes: {},
        }}
      >
        <MenuItem {...props} />
      </MenuContext.Provider>
    )
  }

  it('should render custom item', () => {
    wrapper = mount(<Test renderItem={() => 'hello'} item={{}} />)
    expect(wrapper.text()).toBe('hello')
  })

  it('should render with state', () => {
    wrapper = mount(<Test item={{ state: '"foo"' }} />)
    expect(wrapper.find(Link).prop('state')()).toBe('foo')
  })
})
