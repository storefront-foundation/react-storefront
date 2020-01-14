import React, { useState } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import AutoScrollToNewChildren from 'react-storefront/AutoScrollToNewChildren'

describe('AutoScrollToNewChildren', () => {
  let wrapper, scrollIntoView

  beforeEach(() => {
    scrollIntoView = jest
      .spyOn(HTMLElement.prototype, 'scrollIntoView')
      .mockImplementation(options => options)
  })

  afterEach(() => {
    wrapper.unmount()
    scrollIntoView.mockRestore()
  })

  it('should render children', () => {
    wrapper = mount(
      <AutoScrollToNewChildren>
        <div id="child1" />
        <div id="child2" />
        <div id="child3" />
        <div id="child4" />
      </AutoScrollToNewChildren>,
    )

    expect(wrapper.find('div').length).toBe(4)
  })

  it('should add new children on children update with useEffect and scroll to first element', async () => {
    const Test = () => {
      const [counter, setCounter] = useState(0)
      const [elements, setElements] = useState([])

      const addEl = () => {
        setElements(elements.concat(<p key={counter}>test</p>))
        setCounter(counter + 1)
      }

      return (
        <>
          <button onClick={addEl} id="testButton">
            test
          </button>
          <AutoScrollToNewChildren>{elements}</AutoScrollToNewChildren>
        </>
      )
    }

    wrapper = mount(<Test />)

    expect(
      wrapper
        .find(AutoScrollToNewChildren)
        .children()
        .find('p').length,
    ).toBe(0)

    await act(async () => {
      await wrapper.find('#testButton').simulate('click')
      await wrapper.update()
    })

    expect(
      wrapper
        .find(AutoScrollToNewChildren)
        .children()
        .find('p').length,
    ).toBe(1)

    await act(async () => {
      await wrapper.find('#testButton').simulate('click')
      await wrapper.update()
    })

    expect(
      wrapper
        .find(AutoScrollToNewChildren)
        .children()
        .find('p').length,
    ).toBe(2)

    expect(scrollIntoView).toHaveBeenCalledTimes(1)
    expect(scrollIntoView).toHaveBeenCalledWith({ behavior: 'smooth' })
  })
})
