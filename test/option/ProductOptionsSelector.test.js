import React, { useState } from 'react'
import { mount } from 'enzyme'
import ProductOptionSelector from 'react-storefront/option/ProductOptionSelector'
import ProductOption from 'react-storefront/option/ProductOption'

describe('ProductOptionSelector', () => {
  const colors = [
    {
      text: 'Color1',
      id: 'color1',
      image: {
        src: 'src1',
        alt: 'alt1',
      },
    },
  ]
  const sizes = [{ id: 'sm', text: 'sm' }]

  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the right variant depending on options', () => {
    const Test = () => {
      return (
        <>
          <ProductOptionSelector options={colors} />
          <ProductOptionSelector options={sizes} />
        </>
      )
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(ProductOption)
        .first()
        .props().variant,
    ).toBe('swatch')
    expect(
      wrapper
        .find(ProductOption)
        .last()
        .props().variant,
    ).toBe('text')
  })

  it('should call onChange on click', () => {
    const onChangeSpy = jest.fn()

    const Test = () => {
      const [color, setColor] = useState(null)
      const updateColor = value => {
        setColor(value)
        onChangeSpy(value)
      }

      return <ProductOptionSelector value={color} onChange={updateColor} options={colors} />
    }

    wrapper = mount(<Test />)

    wrapper.find('button').simulate('click')
    expect(onChangeSpy).toHaveBeenCalledWith(colors[0])

    wrapper.find('button').simulate('click')
    expect(onChangeSpy).toHaveBeenCalledWith(null)
  })

  it('should return null when options are undefined', () => {
    wrapper = mount(<ProductOptionSelector />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(true)
  })

  it('should render a skeleton with swatches', () => {
    wrapper = mount(<ProductOptionSelector variant="swatch" skeleton={4} />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(false)
  })

  it('should render a skeleton with text', () => {
    wrapper = mount(<ProductOptionSelector variant="text" skeleton={4} />)

    expect(wrapper.find(ProductOptionSelector).isEmptyRender()).toBe(false)
  })
})
