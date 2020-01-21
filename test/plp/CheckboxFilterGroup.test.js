import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import CheckboxFilterGroup from 'react-storefront/plp/CheckboxFilterGroup'
import { Checkbox, FormControlLabel } from '@material-ui/core'

describe('CheckboxFilterGroup', () => {
  let wrapper

  const group = {
    name: 'Size',
    ui: 'buttons',
    options: [
      { name: 'SM', code: 'size:sm' },
      { name: 'MD', code: 'size:md' },
      { name: 'LG', code: 'size:lg' },
      { name: 'XL', code: 'size:xl' },
      { name: 'XXL', code: 'size:xxl' },
    ],
  }

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render as many checkboxes as there are options in group', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: [],
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <CheckboxFilterGroup group={group} />
      </SearchResultsContext.Provider>,
    )

    expect(wrapper.find(Checkbox).length).toBe(group.options.length)
  })

  it('should render checkboxes as selected if they are in filters', () => {
    wrapper = mount(
      <SearchResultsContext.Provider
        value={{
          pageData: {
            filters: ['size:sm', 'size:lg'],
          },
          actions: {
            toggleFilter: jest.fn(),
          },
        }}
      >
        <CheckboxFilterGroup group={group} />
      </SearchResultsContext.Provider>,
    )

    const checkedCheckboxes = wrapper
      .find(Checkbox)
      .filterWhere(item => item.prop('checked') === true)

    expect(checkedCheckboxes.length).toBe(2)
  })

  it('should call toggleFilter function from context on checkbox click', () => {
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
        <CheckboxFilterGroup group={group} />
      </SearchResultsContext.Provider>,
    )

    wrapper
      .find(Checkbox)
      .first()
      .invoke('onChange')()

    expect(toggleFilterSpy).toBeCalled()
    expect(toggleFilterSpy).toHaveBeenCalledWith(group.options[0], undefined)
  })
})
