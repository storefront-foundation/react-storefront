import React from 'react'
import { mount } from 'enzyme'
import MenuContext from 'react-storefront/menu/MenuContext'
import { ChevronRight, ExpandLess, ExpandMore } from '@material-ui/icons'

describe('MenuExpanderIcon', () => {
  let wrapper, MenuExpanderIcon, mockAmp

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => mockAmp,
      }))

      MenuExpanderIcon = require('react-storefront/menu/MenuExpanderIcon').default
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
        <MenuExpanderIcon {...props} />
      </MenuContext.Provider>
    )
  }

  it('should render right icon when not showing expander', () => {
    wrapper = mount(<Test />)
    expect(wrapper.find(ChevronRight).length).toBe(1)
  })

  it('should render collapse icon when expanded', () => {
    wrapper = mount(<Test showExpander expanded />)
    expect(wrapper.find(ExpandLess).length).toBe(1)
    expect(wrapper.find(ExpandMore).length).toBe(0)
  })

  it('should render expand icon when not expanded', () => {
    wrapper = mount(<Test showExpander />)
    expect(wrapper.find(ExpandMore).length).toBe(1)
    expect(wrapper.find(ExpandLess).length).toBe(0)
  })

  it('should render both icons when in amp', () => {
    mockAmp = true
    wrapper = mount(<Test showExpander />)
    expect(wrapper.find(ExpandMore).length).toBe(1)
    expect(wrapper.find(ExpandLess).length).toBe(1)
  })
})
