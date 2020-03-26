import React, { createRef } from 'react'
import { mount } from 'enzyme'
import { goBack, navigate } from '../mocks/mockRouter'
import { windowLocationMock, historyMock } from '../mocks/mockHelper'
import LinkContext from 'react-storefront/link/LinkContext'
import useLazyState from 'react-storefront/hooks/useLazyState'
import { act } from 'react-dom/test-utils'

jest.useFakeTimers()

describe('useLazyState', () => {
  let additionalData, wrapper, historyData, state

  const replaceStateMock = jest.fn((data, url, title) => (historyData = data))

  const Test = props => {
    const [store, setStore] = useLazyState(props, additionalData)

    state = store

    return null
  }

  beforeAll(() => {
    windowLocationMock('/testurl')
  })

  beforeEach(() => {
    historyMock(replaceStateMock)
    additionalData = undefined
    historyData = undefined
    state = undefined
    replaceStateMock.mockClear()
  })

  afterEach(() => {
    if (wrapper.exists()) wrapper.unmount()
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should return props and do nothing if there are no lazy props', () => {
    wrapper = mount(<Test foo="bar" />)

    expect(state).toEqual({ foo: 'bar', loading: false, pageData: {} })
  })

  it('should include the specified additionalData', () => {
    additionalData = { additional: { test: 'foo' } }
    wrapper = mount(<Test foo="bar" />)
    expect(state).toEqual({
      foo: 'bar',
      additional: { test: 'foo' },
      loading: false,
      pageData: {},
    })
  })

  it('should render again once lazyProps have been resolved', async () => {
    wrapper = mount(<Test pageData={{ again: false }} />)

    expect(state).toEqual({ loading: false, pageData: { again: false } })

    await act(async () => {
      await wrapper.setProps({ lazy: Promise.resolve({ pageData: { again: true } }) })
    })

    expect(state).toEqual({ loading: false, pageData: { again: true } })
  })

  it('should record pageData in history when navigating', async () => {
    await act(async () => {
      wrapper = await mount(<Test lazy={Promise.resolve({ pageData: { lazy: true } })} />)
    })

    navigate()

    expect(historyData).toEqual({ as: '/testurl', rsf: { '/testurl': { lazy: true } } })
  })

  it('should not record pageData when going back', async () => {
    wrapper = mount(<Test pageData={{ x: 'y' }} />)

    navigate() // Called once
    goBack()

    expect(replaceStateMock).toHaveBeenCalledTimes(1)
  })

  it('should not record pageData when loading is true', async () => {
    const promise = new Promise((resolve, reject) => {
      sleep(1000).then(() => {
        resolve({})
      })
    })

    wrapper = mount(<Test />)

    wrapper.setProps({ lazy: promise })
    navigate()
    expect(replaceStateMock).toHaveBeenCalledTimes(0)

    await act(async () => {
      await jest.runOnlyPendingTimers()
    })
  })

  it('should update the store if lazy prop changes', async () => {
    const testPromise1 = new Promise((resolve, reject) => {
      sleep(1000).then(() => {
        resolve({ pageData: { value: 1 } })
      })
    })
    wrapper = mount(<Test pageData={{ test: true }} />)

    await act(async () => {
      await wrapper.setProps({ lazy: testPromise1 })
    })

    expect(state).toEqual({ loading: true, pageData: { test: true } })

    await act(async () => {
      await jest.runOnlyPendingTimers()
    })

    expect(state).toEqual({ loading: false, pageData: { value: 1 } })

    await act(async () => {
      await wrapper.setProps({ lazy: Promise.resolve({ pageData: { value: 2 } }) })
    })

    expect(state).toEqual({
      loading: false,
      pageData: { value: 2 },
    })
  })

  it('should update the store if props changed', async () => {
    wrapper = mount(<Test pageData={{ test: true }} />)

    expect(state).toEqual({ loading: false, pageData: { test: true } })

    await act(async () => {
      await wrapper.setProps({ pageData: { value: 1 } })
    })

    expect(state).toEqual({ loading: false, pageData: { value: 1 } })

    await act(async () => {
      await wrapper.setProps({ pageData: { value: 2 } })
    })

    expect(state).toEqual({
      loading: false,
      pageData: { value: 2 },
    })
  })

  it('should not update the store if loading is true and new props came in', async () => {
    const testPromise1 = new Promise((resolve, reject) => {
      sleep(1000).then(() => {
        resolve({ pageData: { value: 1 } })
      })
    })

    wrapper = mount(<Test pageData={{ test: true }} />)

    expect(state).toEqual({ loading: false, pageData: { test: true } })

    await act(async () => {
      await wrapper.setProps({ lazy: testPromise1 })
    })

    expect(state).toEqual({ loading: true, pageData: { test: true } })

    await act(async () => {
      await wrapper.setProps({ pageData: { value: 1 } })
    })

    expect(state).toEqual({ loading: true, pageData: { test: true } })

    await act(async () => {
      await jest.runOnlyPendingTimers()
    })
  })

  it('should apply pageData from LinkContext', () => {
    const ref = createRef()
    ref.current = { skeleton: true }

    wrapper = mount(
      <LinkContext.Provider value={ref}>
        <Test value={1} />
      </LinkContext.Provider>,
    )

    expect(state).toEqual({
      loading: false,
      pageData: {
        skeleton: true,
      },
      value: 1,
    })
  })

  it('should expose rsf_toggleLoading', () => {
    wrapper = mount(<Test value={1} />)
    act(() => window.rsf_toggleLoading())
    expect(state.loading).toBe(true)
    wrapper.unmount()
    expect(window.rsf_toggleLoading).not.toBeDefined()
  })

  describe('production', () => {
    let { NODE_ENV } = process.env

    beforeAll(() => {
      process.env.NODE_ENV = 'production'
    })

    afterAll(() => {
      process.env.NODE_ENV = NODE_ENV
    })

    it('should not expose rsf_toggleLoading in production', () => {
      wrapper = mount(<Test value={1} />)
      act(() => {})
      expect(window.rsf_toggleLoading).not.toBeDefined()
    })
  })
})
