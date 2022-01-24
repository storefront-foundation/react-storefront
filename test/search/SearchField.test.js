import React, { useState } from 'react'
import { mount } from 'enzyme'
import SearchField from 'react-storefront/search/SearchField'
import SearchSubmitButton from 'react-storefront/search/SearchSubmitButton'
import { Fab, Button } from '@mui/material'
import { IconButton } from '@mui/material'

describe('SearchField', () => {
  let wrapper, getQuery
  const suggestionsSpy = jest.fn()

  afterEach(() => {
    wrapper.unmount()
    suggestionsSpy.mockReset()
    getQuery = undefined
  })

  const TestComponent = props => {
    const [query, setQuery] = useState('')
    getQuery = query

    return <SearchField onChange={value => setQuery(value)} value={query} {...props} />
  }

  it('should change query on input change', async () => {
    wrapper = mount(<TestComponent />)

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(getQuery).toBe('test')

    wrapper.find('input').simulate('change', { target: { value: 'test2' } })

    expect(getQuery).toBe('test2')
  })

  it('should spread props to the search field', async () => {
    wrapper = mount(<SearchField spreadprops="spread" />)

    expect(wrapper.find(SearchField).prop('spreadprops')).toBe('spread')
  })

  it.skip('should reset input value on clear click', async () => {
    wrapper = mount(<TestComponent />)

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(wrapper.find('input').prop('value')).toBe('test')

    wrapper.find(IconButton).simulate('click')

    expect(wrapper.find('input').prop('value')).toBe('')
  })

  it('should select whole text on focus', async () => {
    const selectionSpy = jest.spyOn(HTMLInputElement.prototype, 'setSelectionRange')

    wrapper = mount(<TestComponent />)

    wrapper.find('input').simulate('change', { target: { value: 'test' } })
    wrapper.find('input').simulate('focus')

    expect(selectionSpy).toHaveBeenCalledWith(0, 4)
    selectionSpy.mockRestore()
  })

  it('should hide clear button when input has no value', async () => {
    wrapper = mount(<TestComponent />)

    expect(wrapper.find(SearchSubmitButton).prop('className')).toContain('hidden')

    wrapper.find('input').simulate('change', { target: { value: 'test' } })

    expect(wrapper.find(SearchSubmitButton).prop('className')).not.toContain('hidden')
  })

  it('should by default render submit button as fab', async () => {
    wrapper = mount(<SearchField />)

    expect(wrapper.find(Fab)).toExist()
    expect(wrapper.find(Button)).not.toExist()
  })

  it('should by render icon button when submitButtonVariant prop is icon', async () => {
    wrapper = mount(<TestComponent submitButtonVariant="icon" showClearButton={false} />)

    expect(wrapper.find(Fab)).not.toExist()
    expect(wrapper.find(Button)).toExist()
  })

  it('should call onFocus method if provided, when focusing', async () => {
    const onFocusSpy = jest.fn()
    wrapper = mount(<TestComponent onFocus={onFocusSpy} />)

    wrapper.find('input').simulate('focus')

    expect(onFocusSpy).toBeCalled()
  })

  it('should not display any submit buttons when submitButtonVariant prop value is none', async () => {
    wrapper = mount(<TestComponent submitButtonVariant="none" showClearButton={false} />)

    expect(wrapper.find('button')).not.toExist()
  })
})
