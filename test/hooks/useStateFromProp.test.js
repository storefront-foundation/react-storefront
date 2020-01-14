import React from 'react'
import { mount } from 'enzyme'
import useStateFromProp from 'react-storefront/hooks/useStateFromProp'
import sleep from '../config/sleep'

describe('useStateFromProp', () => {
  it('should update when the prop changes', () => {
    let renderCount = 0,
      lastState

    const Test = ({ value }) => {
      const [state, setState] = useStateFromProp(value)
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
