import React from 'react'
import { mount } from 'enzyme'
import SearchField from 'react-storefront/search/SearchField'
import SearchContext from 'react-storefront/search/SearchContext'
import SearchSubmitButton from 'react-storefront/search/SearchSubmitButton'
import { Fab, Button } from '@material-ui/core'
import { IconButton } from '@material-ui/core'

describe('SearchField', () => {
  let wrapper
  const suggestionsSpy = jest.fn()

  afterEach(() => {
    wrapper.unmount()
    suggestionsSpy.mockReset()
  })

  it('should fetch suggestions on input change', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField />
      </SearchContext.Provider>,
    )

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(suggestionsSpy).toHaveBeenCalledTimes(1)

    wrapper.find('input').simulate('change', { target: { value: 'test2' } })

    expect(suggestionsSpy).toHaveBeenCalledTimes(2)
  })

  it('should spread props to the search field', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField spreadprops="spread" />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(SearchField).prop('spreadprops')).toBe('spread')
  })

  it('should reset input value on clear click', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField />
      </SearchContext.Provider>,
    )

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(wrapper.find('input').prop('value')).toBe('test')

    wrapper.find(IconButton).simulate('click')

    expect(wrapper.find('input').prop('value')).toBe('')
  })

  it('should select whole text on focus', async () => {
    const selectionSpy = jest.spyOn(HTMLInputElement.prototype, 'setSelectionRange')

    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField />
      </SearchContext.Provider>,
    )

    wrapper.find('input').simulate('change', { target: { value: 'test' } })
    wrapper.find('input').simulate('focus')

    expect(selectionSpy).toHaveBeenCalledWith(0, 4)
    selectionSpy.mockRestore()
  })

  it('should hide clear button when input has no value', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(SearchSubmitButton).prop('className')).toContain('hidden')

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(wrapper.find(SearchSubmitButton).prop('className')).not.toContain('hidden')
  })

  it('should by default render submit button as fab', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(Fab)).toExist()
    expect(wrapper.find(Button)).not.toExist()
  })

  it('should by render icon button when submitButtonVariant prop is icon', async () => {
    wrapper = mount(
      <SearchContext.Provider value={{ fetchSuggestions: suggestionsSpy }}>
        <SearchField submitButtonVariant="icon" showClearButton={false} />
      </SearchContext.Provider>,
    )

    expect(wrapper.find(Fab)).not.toExist()
    expect(wrapper.find(Button)).toExist()
  })
})
