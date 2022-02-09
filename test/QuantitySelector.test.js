import React, { useState } from 'react'
import { mount } from 'enzyme'
import QuantitySelector from 'react-storefront/QuantitySelector'

describe('QuantitySelector', () => {
  let wrapper,
    name,
    addIcon,
    subtractIcon,
    minValue,
    maxValue,
    ariaLabel,
    quantity = 1,
    getValue,
    handleChange

  const clearValues = () => {
    wrapper.unmount()
    name = undefined
    addIcon = undefined
    subtractIcon = undefined
    minValue = undefined
    maxValue = undefined
    ariaLabel = undefined
    quantity = 1
    getValue = undefined
    handleChange = undefined
  }

  const Test = () => {
    const [value, setValue] = useState(quantity)
    getValue = value

    return (
      <QuantitySelector
        minValue={minValue}
        maxValue={maxValue}
        onChange={handleChange ? value => handleChange(value, setValue) : undefined}
        addIcon={addIcon}
        subtractIcon={subtractIcon}
        name={name}
        ariaLabel={ariaLabel}
        value={value}
      />
    )
  }

  describe('should render component with default values', () => {
    afterEach(() => {
      clearValues()
    })

    it('should have right default aria labels', () => {
      wrapper = mount(<Test />)
      const ariaLabelFinder = wrapper.findWhere(n => n.prop('aria-label'))

      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes('subtract one quantity'))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes('add one quantity'))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder.filterWhere(n => n.prop('aria-label').includes('does not exist')).exists(),
      ).toBe(false)
    })

    it('should have right default name', () => {
      wrapper = mount(<Test />)

      expect(
        wrapper.findWhere(n => n.prop('name') && n.prop('name').includes('quantity')).exists(),
      ).toBe(true)
    })

    it('should not allow subtracting more than default min value', () => {
      quantity = 1
      wrapper = mount(<Test />)

      wrapper
        .find('.MuiIconButton-root')
        .at(3)
        .simulate('click')

      expect(getValue).toBe(1)
    })

    it('should not allow adding more than default max value', () => {
      quantity = 100
      wrapper = mount(<Test />)

      wrapper
        .find('.MuiIconButton-root')
        .last()
        .simulate('click')

      expect(getValue).toBe(100)
    })

    it('should have right initial value', () => {
      quantity = undefined
      wrapper = mount(<Test />)

      expect(wrapper.find('input').prop('value')).toBe(1)
    })
  })

  describe('should render component with custom values', () => {
    afterEach(() => {
      clearValues()
    })

    it('should trigger onChange fn on click', () => {
      handleChange = (value, setValue) => setValue(value)
      quantity = 1
      wrapper = mount(<Test />)

      wrapper
        .find('.MuiIconButton-root')
        .last()
        .simulate('click')

      expect(getValue).toBe(2)
    })

    it('should not allow adding more than custom max value', () => {
      maxValue = 200
      quantity = 200
      wrapper = mount(<Test />)

      wrapper
        .find('.MuiIconButton-root')
        .last()
        .simulate('click')

      expect(getValue).toBe(maxValue)
    })

    it('should not allow subtracting more than custom min value', () => {
      minValue = 100
      quantity = 100
      wrapper = mount(<Test />)

      wrapper
        .find('.MuiIconButton-root')
        .at(3)
        .simulate('click')

      expect(getValue).toBe(minValue)
    })

    it('should allow custom name', () => {
      name = 'testName'
      wrapper = mount(<Test />)

      expect(wrapper.findWhere(n => n.prop('name') && n.prop('name').includes(name)).exists()).toBe(
        true,
      )
    })

    it('should allow custom aria label', () => {
      ariaLabel = 'customAria'
      wrapper = mount(<Test />)
      const ariaLabelFinder = wrapper.findWhere(n => n.prop('aria-label'))

      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes(`subtract one ${ariaLabel}`))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder
          .filterWhere(n => n.prop('aria-label').includes(`add one ${ariaLabel}`))
          .exists(),
      ).toBe(true)
      expect(
        ariaLabelFinder.filterWhere(n => n.prop('aria-label').includes('does not exist')).exists(),
      ).toBe(false)
    })

    it('should allow custom add icon', () => {
      addIcon = <div id="testAddIcon" />
      wrapper = mount(<Test />)

      expect(wrapper.find('#testAddIcon').exists()).toBe(true)
    })

    it('should allow custom subtract icon', () => {
      subtractIcon = <div id="testSubtractIcon" />
      wrapper = mount(<Test />)

      expect(wrapper.find('#testSubtractIcon').exists()).toBe(true)
    })
  })
})
