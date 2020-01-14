import React from 'react'
import { mount } from 'enzyme'
import ErrorBoundary from 'react-storefront/ErrorBoundary'

describe('ErrorBoundary', () => {
  const errorText = 'Test Error'
  const map = {}
  let wrapper, logger, spy

  afterEach(() => {
    wrapper.unmount()
    spy.mockRestore()
    logger = undefined
  })

  beforeEach(() => {
    spy = jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      map[event] = cb
    })
  })

  const Test = () => {
    const handleError = err => {
      logger = err.error.message || err.error
    }

    return (
      <ErrorBoundary onError={handleError}>
        <div>App</div>
      </ErrorBoundary>
    )
  }

  it('should render app without error', () => {
    wrapper = mount(<Test />)

    expect(wrapper.find(ErrorBoundary).text()).toBe('App')
  })

  it('should render error text on error', () => {
    const error = new Error(errorText)

    wrapper = mount(<Test />)

    wrapper.find(ErrorBoundary).simulateError(error)

    expect(wrapper.find(ErrorBoundary).text()).toBe(errorText)
    expect(logger).toBe(errorText)
  })

  it('should listen to errors and send it to error reporter', () => {
    wrapper = mount(<Test />)

    map.error({ error: errorText })

    expect(logger).toBe(errorText)
  })

  it('should listen to unhandled rejections and send it to error reporter', () => {
    wrapper = mount(<Test />)

    map.unhandledrejection({ reason: errorText })

    expect(logger).toBe(errorText)
  })
})
