import React from 'react'
import { mount } from 'enzyme'
import SearchSubmitButton from 'react-storefront/search/SearchSubmitButton'
import { Button } from '@material-ui/core'

describe('SearchSubmitButton', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render passed button', () => {
    wrapper = mount(<SearchSubmitButton Component={Button} text="" />)
    expect(wrapper.find(Button)).toExist()
  })

  it('should disable button when text is empty string', () => {
    wrapper = mount(<SearchSubmitButton Component={Button} text="" />)
    expect(wrapper.find(Button).prop('disabled')).toBe(true)
  })

  it('should spread props to button', () => {
    wrapper = mount(<SearchSubmitButton Component={Button} text="" spreadprops="spreadpropstest" />)
    expect(wrapper.find(Button).prop('spreadprops')).toBe('spreadpropstest')
  })
})
