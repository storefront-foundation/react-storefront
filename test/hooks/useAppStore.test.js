import React from 'react'
import { mount } from 'enzyme'
import useAppStore from 'react-storefront/hooks/useAppStore'

describe('useAppStore', () => {
  it('should update when the appData changes', () => {
    const Test = props => {
      const [state, _] = useAppStore(props)
      return <div>{state}</div>
    }

    const wrapper = mount(<Test />)
    expect(wrapper.text()).toBe('')
    wrapper.setProps({ appData: 'test' })
    expect(wrapper.text()).toBe('test')
  })

  it('should not update when props changes but not AppData', () => {
    const Test = props => {
      const [state, _] = useAppStore(props)
      return <div>{state}</div>
    }

    const wrapper = mount(<Test appData="test" />)
    expect(wrapper.text()).toBe('test')
    wrapper.setProps({ other: 'test2' })
    expect(wrapper.text()).toBe('test')
  })
})
