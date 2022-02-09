import React, { useState } from 'react'
import { mount } from 'enzyme'
import { Button } from '@mui/material'
import ProductOption from 'react-storefront/option/ProductOption'
import TextProductOption from 'react-storefront/option/TextProductOption'
import SwatchProductOption from 'react-storefront/option/SwatchProductOption'
import { getFiberIndex } from '../methods'

describe('ProductOption', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render TextProductOption if variant is text', () => {
    wrapper = mount(<ProductOption value={{ text: 'test' }} variant="text" />)

    expect(wrapper.find(TextProductOption).exists()).toBe(true)
    expect(wrapper.find(TextProductOption).text()).toBe('test')
  })

  it('should render SwatchProductOption if variant is swatch', () => {
    wrapper = mount(<ProductOption value={{ text: 'test' }} variant="swatch" />)

    expect(wrapper.find(SwatchProductOption).exists()).toBe(true)
    expect(wrapper.find(SwatchProductOption).text()).toBe('test')
  })

  it('should have selected true if selectedOption matches value', () => {
    const option = { id: 'test', text: 'test' }

    wrapper = mount(<ProductOption value={option} selectedOption={option} variant="text" />)

    expect(wrapper.find(TextProductOption).prop('selected')).toBe(true)
    expect(wrapper.find(Button).prop('variant')).toBe('contained')
    expect(wrapper.find(Button).prop('color')).toBe('primary')
  })

  it('should have not show labels if showLabel prop is false', () => {
    const option = { id: 'test', text: 'test' }

    wrapper = mount(
      <ProductOption value={option} selectedOption={option} showLabel={false} variant="swatch" />,
    )

    expect(wrapper.find(SwatchProductOption).text()).toBe('')
  })

  it('should trigger passed onClick function on click', () => {
    const onClickSpy = jest.fn()

    wrapper = mount(
      <ProductOption value={{ text: 'test' }} onClick={onClickSpy} variant="swatch" />,
    )

    wrapper.find('button').simulate('click')

    expect(onClickSpy).toBeCalled()
  })

  it('should trigger passed onSelectedOptionChange function on click passing right value', () => {
    const option = { id: 'test', text: 'test' }
    let setter = undefined
    const onClickSpy = jest.fn().mockImplementation(value => setter(value))

    const Test = () => {
      const [selected, setSelected] = useState(option)
      setter = setSelected

      return (
        <ProductOption
          value={option}
          selectedOption={selected}
          onSelectedOptionChange={value => onClickSpy(value)}
          variant="swatch"
        />
      )
    }

    wrapper = mount(<Test />)

    wrapper.find('button').simulate('click')

    expect(onClickSpy).toHaveBeenCalledWith(null)

    wrapper.find('button').simulate('click')

    expect(onClickSpy).toHaveBeenCalledWith(option)
  })

  it('should not call onSelectedOptionChange function if option is disabled', () => {
    const option = { id: 'test', text: 'test', disabled: true }
    let setter = undefined
    const onClickSpy = jest.fn().mockImplementation(value => setter(value))

    const Test = () => {
      const [selected, setSelected] = useState(option)
      setter = setSelected

      return (
        <ProductOption
          value={option}
          selectedOption={selected}
          onSelectedOptionChange={value => onClickSpy(value)}
          variant="swatch"
        />
      )
    }

    wrapper = mount(<Test />)
    wrapper.find('button').simulate('click')
    expect(onClickSpy).not.toHaveBeenCalled()
  })

  it('should have a strike-through element if strikeThroughDisabled is true', () => {
    const option = { id: 'test', text: 'test', disabled: true }

    wrapper = mount(
      <ProductOption
        value={option}
        selectedOption={option}
        showLabel={false}
        variant="swatch"
        strikeThroughDisabled
      />,
    )

    expect(
      wrapper
        .find('button')
        .children()
        .someWhere(child => child.hasClass(/strikeThrough/)),
    ).toEqual(true)

    // also try for TextOption:
    wrapper = mount(
      <ProductOption
        value={option}
        selectedOption={option}
        showLabel
        variant="text"
        strikeThroughDisabled
      />,
    )

    expect(
      wrapper
        .find('.RSFTextProductOption-strikeThrough')
        .exists()
    ).toEqual(true)
  })

  it('should set the background color based on the color prop', () => {
    const option = { id: 'test', color: '#ffffff' }

    wrapper = mount(
      <ProductOption
        value={option}
        selectedOption={option}
        showLabel
        variant="swatch"
        color="#ffffff"
      />,
    )

    expect(wrapper.find('button > div + div').props().style.backgroundColor).toEqual(option.color)
  })
})
