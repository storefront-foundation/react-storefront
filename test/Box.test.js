import React from 'react'
import { mount } from 'enzyme'
import Box, { Hbox, Vbox } from 'react-storefront/Box'

describe('Box', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component without props', () => {
    wrapper = mount(<Box />)

    expect(wrapper.find(Box).exists()).toBe(true)
  })

  it('should render children', () => {
    wrapper = mount(
      <Box>
        <div id="test">test</div>
      </Box>,
    )

    expect(wrapper.find('#test').text()).toBe('test')
  })

  it('should forward props to style', () => {
    wrapper = mount(<Box test="test" />)

    expect(
      wrapper
        .find(Box)
        .childAt(0)
        .prop('style').test,
    ).toBe('test')
  })

  it('should apply split classes when split is set to true', () => {
    wrapper = mount(<Box split />)

    expect(
      wrapper
        .find(Box)
        .childAt(0)
        .prop('className'),
    ).toContain('split')
  })

  describe('Hbox', () => {
    it('should render component without props', () => {
      wrapper = mount(<Hbox />)

      expect(wrapper.find(Hbox).exists()).toBe(true)
    })

    it('should have flex direction set to row', () => {
      wrapper = mount(<Hbox />)

      expect(
        wrapper
          .find(Box)
          .childAt(0)
          .prop('style').flexDirection,
      ).toBe('row')
    })
  })

  describe('Vbox', () => {
    it('should render component without props', () => {
      wrapper = mount(<Vbox />)

      expect(wrapper.find(Vbox).exists()).toBe(true)
    })

    it('should have flex direction set to column', () => {
      wrapper = mount(<Vbox />)

      expect(
        wrapper
          .find(Box)
          .childAt(0)
          .prop('style').flexDirection,
      ).toBe('column')
    })
  })
})
