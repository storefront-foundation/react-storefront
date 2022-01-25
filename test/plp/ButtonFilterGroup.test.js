import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import ButtonFilterGroup from 'react-storefront/plp/ButtonFilterGroup'
import SwatchProductOption from 'react-storefront/option/SwatchProductOption'
import TextProductOption from 'react-storefront/option/TextProductOption'

describe('ButtonFilterGroup', () => {
  let wrapper

  const group1 = {
    name: 'Type',
    ui: 'checkboxes',
    options: [
      { name: 'New', code: 'type:new', matches: 100 },
      { name: 'Used', code: 'type:used' },
    ],
  }

  const group2 = {
    name: 'Color',
    options: [
      {
        name: 'Red',
        code: `color:red`,
        image: {
          src: `test/red`,
          alt: 'red',
        },
      },
    ],
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render TextProductOptions when passed groups without image key', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['type:new'],
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <ButtonFilterGroup group={group1} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(TextProductOption).length).toBe(group1.options.length)
    expect(
      wrapper
        .find(TextProductOption)
        .first()
        .prop('selected'),
    ).toBe(true)
    expect(
      wrapper
        .find(TextProductOption)
        .first()
        .text(),
    ).toBe('New(100)')
  })

  it('should render SwatchProductOptions when passed groups with image key', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['color:red'],
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <ButtonFilterGroup group={group2} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(SwatchProductOption).length).toBe(group2.options.length)
    expect(
      wrapper
        .find(SwatchProductOption)
        .first()
        .prop('selected'),
    ).toBe(true)
    expect(
      wrapper
        .find(SwatchProductOption)
        .first()
        .prop('imageProps'),
    ).toBe(group2.options[0].image)
  })

  it.skip('should call toggleFilter function from context on button click', () => {
    const toggleFilterSpy = jest.fn()

    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
          },
          actions: {
            toggleFilter: toggleFilterSpy,
          },
        }}
      >
        <ButtonFilterGroup group={group1} />
      </SearchResultsContext.Provider>,
    )

    wrapper
      .find(TextProductOption)
      .first()
      .simulate('click')

    expect(toggleFilterSpy).toBeCalled()
    expect(toggleFilterSpy).toHaveBeenCalledWith(group1.options[0], undefined)
  })
})
 