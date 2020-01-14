import React from 'react'
import { mount } from 'enzyme'
import withDefaultHandler from 'react-storefront/utils/withDefaultHandler'

describe('withDefaultHandler', () => {
  let wrapper

  beforeEach(() => {})

  afterEach(() => {
    wrapper.unmount()
  })

  it('should call the provided handler and the default handler', () => {
    const defaultHandler = jest.fn()
    const handler = jest.fn()

    const Test = ({ onClick }) => {
      const handleClick = withDefaultHandler(onClick, defaultHandler)
      return <button onClick={handleClick}></button>
    }

    wrapper = mount(<Test onClick={handler} />)

    wrapper.find('button').simulate('click')
    expect(handler).toHaveBeenCalled()
    expect(defaultHandler).toHaveBeenCalled()
  })

  it('should not call the default handler if e.preventDefault() is called', () => {
    const defaultHandler = jest.fn()
    const handler = jest.fn(e => e.preventDefault())

    const Test = ({ onClick }) => {
      const handleClick = withDefaultHandler(onClick, defaultHandler)
      return <button onClick={handleClick}></button>
    }

    wrapper = mount(<Test onClick={handler} />)

    wrapper.find('button').simulate('click')
    expect(handler).toHaveBeenCalled()
    expect(defaultHandler).not.toHaveBeenCalled()
  })

  it('should not fail if a handler is not provided', () => {
    const defaultHandler = jest.fn()

    const Test = ({ onClick }) => {
      const handleClick = withDefaultHandler(onClick, defaultHandler)
      return <button onClick={handleClick}></button>
    }

    wrapper = mount(<Test />)

    wrapper.find('button').simulate('click')
    expect(defaultHandler).toHaveBeenCalled()
  })
})
