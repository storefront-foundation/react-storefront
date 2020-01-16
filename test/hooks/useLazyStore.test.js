import React, { createRef } from 'react'
import { mount } from 'enzyme'
import { goBack, navigate } from '../mocks/mockRouter'
import { windowLocationMock, historyMock } from '../mocks/mockHelper'
import LinkContext from 'react-storefront/link/LinkContext'
import useLazyStore from 'react-storefront/hooks/useLazyStore'
import { act } from 'react-dom/test-utils'

jest.useFakeTimers()

describe('useLazyStore', () => {
  let values, updateStore, additionalData, wrapper, historyData

  const replaceStateMock = jest.fn((data, url, title) => (historyData = data))

  const Test = props => {
    const [store, setStore] = useLazyStore(props, additionalData)
    values.push(store)
    updateStore = setStore
    return null
  }

  beforeAll(() => {
    windowLocationMock('/testurl')
  })

  beforeEach(() => {
    historyMock(replaceStateMock)
    values = []
    additionalData = undefined
    updateStore = undefined
    historyData = undefined
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
    expect(values).toHaveLength(1)
    expect(updateStore).toBeDefined()
    expect(values[0]).toEqual({ foo: 'bar', loading: false, pageData: {} })
  })

  it('should include the specified additionalData', () => {
    additionalData = { additional: { test: 'foo' } }
    wrapper = mount(<Test foo="bar" />)
    expect(values).toHaveLength(1)
    expect(values[0]).toEqual({
      foo: 'bar',
      additional: { test: 'foo' },
      loading: false,
      pageData: {},
    })
  })

  it('should render again once lazyProps have been resolved', async () => {
    fetch.mockResponseOnce(JSON.stringify({ pageData: { again: true } }))
    wrapper = mount(<Test pageData={{ again: false }} />)

    expect(values).toHaveLength(1)
    expect(values[0]).toEqual({ loading: false, pageData: { again: false } })

    await act(async () => {
      await wrapper.setProps({ lazy: 'test' })
    })

    expect(values[2]).toEqual({ loading: true, pageData: { again: false } })
    expect(values[3]).toEqual({ loading: false, pageData: { again: true } })
  })

  it('should record lazy pageData in history when navigating', async () => {
    fetch.mockResponseOnce(JSON.stringify({ pageData: { lazy: true } }))

    await act(async () => {
      wrapper = await mount(<Test lazy="test" />)
    })

    navigate()

    expect(historyData).toEqual({ as: '/testurl', rsf: { '/testurl': { lazy: true } } })
  })

  it('should record eager pageData in history when navigating', () => {
    wrapper = mount(<Test pageData={{ eager: true }} />)

    navigate()

    expect(historyData).toEqual({ as: '/testurl', rsf: { '/testurl': { eager: true } } })
  })

  it('should not record pageData when going back', async () => {
    wrapper = mount(<Test pageData={{ x: 'y' }} />)

    navigate() // Called once
    goBack()

    expect(replaceStateMock).toHaveBeenCalledTimes(1)
  })

  it('should not record pageData when loading is true', async () => {
    fetch.mockResponseOnce(async () => {
      await sleep(1000)
      return { body: JSON.stringify({}) }
    })

    wrapper = mount(<Test />)

    wrapper.setProps({ lazy: 'test' })
    navigate()
    expect(replaceStateMock).toHaveBeenCalledTimes(0)

    await act(async () => {
      await jest.runOnlyPendingTimers()
    })
  })

  it('should update the store if lazy prop changes', async () => {
    wrapper = mount(<Test pageData={{ test: true }} />)

    fetch.mockResponseOnce(JSON.stringify({ pageData: { value: 1 } }))
    await act(async () => {
      await wrapper.setProps({ lazy: '/data/1' })
    })

    expect(values[0]).toEqual({ loading: false, pageData: { test: true } })
    expect(values[2]).toEqual({ loading: true, pageData: { test: true } })
    expect(values[3]).toEqual({ loading: false, pageData: { test: true, value: 1 } })

    fetch.mockResponseOnce(JSON.stringify({ pageData: { value: 2 } }))
    await act(async () => {
      await wrapper.setProps({ lazy: '/data/2' })
    })

    expect(values[values.length - 1]).toEqual({
      loading: false,
      pageData: { test: true, value: 2 },
    })
  })

  // This use case is when you start going back
  it('should update the store when requestId changes ', async () => {
    wrapper = mount(<Test value={1} />)

    await act(async () => {
      await wrapper.setProps({ value: 2, requestId: 1 })
    })
    expect(values[2].value).toBe(2)
  })

  it('should apply pageData from LinkContext', () => {
    const ref = createRef()
    ref.current = { skeleton: true }

    wrapper = mount(
      <LinkContext.Provider value={ref}>
        <Test value={1} />
      </LinkContext.Provider>,
    )

    expect(values).toHaveLength(1)
    expect(values[0]).toEqual({
      loading: false,
      pageData: {
        skeleton: true,
      },
      value: 1,
    })
  })
})
