import React from 'react'
import { mount } from 'enzyme'
import NoScript from 'react-storefront/NoScript'

describe('NoScript', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render div with srpeaded props when NODE_ENV is test', () => {
    wrapper = mount(<NoScript test="test" />)

    expect(wrapper.find('div').exists()).toBe(true)
    expect(wrapper.find('div').prop('test')).toBe('test')
  })

  it('should render no script when NODE_ENV is not test', () => {
    process.env = Object.assign(process.env, { NODE_ENV: null })
    wrapper = mount(<NoScript test="test" />)

    expect(wrapper.find('noscript').exists()).toBe(true)
    expect(wrapper.find('noscript').prop('test')).toBe('test')
  })
})
