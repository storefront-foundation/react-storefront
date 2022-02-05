import React from 'react'
import { mount } from 'enzyme'
import Sort from 'react-storefront/plp/Sort'
import { Button, MenuItem } from '@mui/material'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import { getFiberIndex } from '../methods'

describe('Sort', () => {
  const mockSetSort = jest.fn()
  let onSelectHandler,
    selectedSort = '',
    variant

  const sortOptions = [
    { name: 'Price - Lowest', code: 'price_asc' },
    { name: 'Price - Highest', code: 'price_desc' },
    { name: 'Most Popular', code: 'pop' },
    { name: 'Highest Rated', code: 'rating' },
  ]

  let wrapper

  afterEach(() => {
    wrapper.unmount()
    jest.resetAllMocks()
    selectedSort = ''
    onSelectHandler = undefined
    variant = undefined
  })

  const Test = () => {
    return (
      <SearchResultsContext.Provider
        value={{
          pageData: { sort: selectedSort, sortOptions: sortOptions },
          actions: { setSort: mockSetSort },
        }}
      >
        <Sort onSelect={onSelectHandler} variant={variant} />
      </SearchResultsContext.Provider>
    )
  }

  it('should render by default buttons', () => {
    wrapper = mount(<Test />)

    expect(wrapper.find(Button).length).toBe(4)
  })

  it('should set button color to primary for selected sort', () => {
    selectedSort = 'rating'
    wrapper = mount(<Test />)

    const selected = wrapper.find(Button).filterWhere(el => el.prop('color') === 'primary')

    expect(selected.text()).toBe('Highest Rated')
  })

  it('should render menu when variant is menu-items', () => {
    variant = 'menu-items'
    wrapper = mount(<Test />)

    expect(wrapper.find(MenuItem).length).toBe(4)
  })

  it('should be empty render when variant is unknown', () => {
    const warningSpy = jest.spyOn(console, 'error').mockImplementation(() => jest.fn())
    variant = 'test'

    wrapper = mount(<Test />)

    expect(wrapper.find(Sort).isEmptyRender()).toBe(true)
    expect(warningSpy).toHaveBeenCalled()

    warningSpy.mockRestore()
  })

  it('should call provided onSelect fn on click - Buttons', () => {
    onSelectHandler = jest.fn()

    wrapper = mount(<Test />)

    wrapper
      .find('.MuiButton-root')
      .at(getFiberIndex(0))
      .simulate('click')

    expect(onSelectHandler.mock.calls[0][0]).toBe(sortOptions[0])
    expect(mockSetSort).toHaveBeenCalledTimes(1)
  })

  it('should call provided onSelect fn on click - Menu', () => {
    onSelectHandler = jest.fn()
    variant = 'menu-items'

    wrapper = mount(<Test />)

    wrapper
      .find('.MuiMenuItem-root')
      .at(getFiberIndex(0))
      .simulate('click')

    expect(onSelectHandler.mock.calls[0][0]).toBe(sortOptions[0])
    expect(mockSetSort).toHaveBeenCalledTimes(1)
  })

  it('should prevent setting sort when e.preventDefault is triggered', () => {
    onSelectHandler = (_, e) => e.preventDefault()

    wrapper = mount(<Test />)

    wrapper
      .find('.MuiButton-root')
      .at(getFiberIndex(0))
      .simulate('click')

    expect(mockSetSort).toHaveBeenCalledTimes(0)
  })
})
