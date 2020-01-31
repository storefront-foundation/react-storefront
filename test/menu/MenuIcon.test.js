import React from 'react'
import { mount } from 'enzyme'
import MenuContext from 'react-storefront/menu/MenuContext'

describe('MenuIcon', () => {
  let wrapper, MenuIcon, mockAmp

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => mockAmp,
      }))

      MenuIcon = require('react-storefront/menu/MenuIcon').default
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  afterAll(() => {
    jest.resetModules()
  })

  const Test = ({ ...props }) => {
    return (
      <MenuContext.Provider
        value={{
          classes: {},
        }}
      >
        <MenuIcon {...props} />
      </MenuContext.Provider>
    )
  }

  it('should render menu label', () => {
    wrapper = mount(<Test label />)
    expect(wrapper.text()).toBe('menu')
  })

  it('should render one icon in non-amp env', () => {
    wrapper = mount(<Test />)
    expect(wrapper.find('.rsf-hamburger').length).toBe(1)
  })

  it('should render two icons in amp', () => {
    mockAmp = true
    wrapper = mount(<Test />)
    expect(wrapper.find('.rsf-hamburger').length).toBe(2)
  })
})
