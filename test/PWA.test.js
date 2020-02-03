import React, { useContext } from 'react'
import { mount } from 'enzyme'
import PWA from 'react-storefront/PWA'
import PWAContext from 'react-storefront/PWAContext'
import { eventListenersMock } from './mocks/mockHelper'
import { act } from 'react-dom/test-utils'

describe('PWA', () => {
  const map = {}
  let wrapper, onLine, getOffline

  const TestComponent = () => {
    const { offline } = useContext(PWAContext)
    getOffline = offline

    return <div>{offline}</div>
  }

  beforeAll(() => {
    eventListenersMock(map)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    wrapper.unmount()
    onLine = undefined
    getOffline = undefined
  })

  beforeEach(() => {
    fetch.mockResponseOnce(JSON.stringify({}))
    jest.spyOn(window, 'navigator', 'get').mockImplementation(options => ({ ...options, onLine }))
  })

  it('should render children', () => {
    wrapper = mount(
      <PWA>
        <div id="test">test</div>
      </PWA>,
    )

    expect(wrapper.find('#test')).toExist()
  })

  it('should manage the offline and online state when default state is online', () => {
    onLine = true

    wrapper = mount(
      <PWA>
        <TestComponent />
      </PWA>,
    )

    expect(getOffline).toBe(false)

    act(() => {
      map.offline()
    })

    expect(getOffline).toBe(true)
  })

  it('should manage the offline and online state when default state is offline', () => {
    onLine = false

    wrapper = mount(
      <PWA>
        <TestComponent />
      </PWA>,
    )

    expect(getOffline).toBe(true)

    act(() => {
      map.online()
    })

    expect(getOffline).toBe(false)
  })
})
