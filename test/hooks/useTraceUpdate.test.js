import React from 'react'
import useTraceUpdate from 'react-storefront/hooks/useTraceUpdate'
import { mount } from 'enzyme'

describe('useTraceUpdate', () => {
  it('should print the props that changed', () => {
    const Test = props => {
      useTraceUpdate(props)
      return null
    }
    const log = jest.spyOn(console, 'log').mockImplementation()
    const wrapper = mount(<Test value={1} />)
    wrapper.setProps({ value: 1 })
    expect(log).toHaveBeenCalledWith('nothing changed')
    wrapper.setProps({ value: 2 })
    expect(log).toHaveBeenCalledWith('Changed props:', { value: [1, 2] })
  })
})
