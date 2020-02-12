import React from 'react'
import { mount } from 'enzyme'
import useAppStore from 'react-storefront/hooks/useAppStore'

describe('useAppStore', () => {
  it('should update when the prop changes', () => {
    let renderCount = 0,
      lastState

    const Test = ({ value }) => {
      const [state, setState] = useAppStore(value)
      renderCount++
      lastState = state
      return <div>{state}</div>
    }

    const wrapper = mount(<Test value={1} />)
    wrapper.setProps({ value: 2 })
    expect(renderCount).toBe(3)
    expect(lastState).toBe(2)
  })
})
