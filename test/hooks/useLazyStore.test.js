import React, { createRef } from 'react'
import { mount } from 'enzyme'
import supressActWarnings from '../config/suppressActWarnings'
import { goBack, navigate } from '../mocks/mockRouter'
import LinkContext from 'react-storefront/link/LinkContext'
import useLazyStore from 'react-storefront/hooks/useLazyStore'

describe('useLazyStore', () => {
  let restore, values, Test, updateStore, additionalData, wrapper

  beforeAll(() => {
    restore = supressActWarnings()
  })

  afterAll(() => {
    restore()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    values = []
    additionalData = null
    Test = props => {
      const returned = useLazyStore(props, additionalData)
      values.push(returned[0])
      updateStore = returned[1]
      return null
    }
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
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

  it('should render again once lazyProps have been resolved', () => {
    global.fetch.mockResponseOnce(JSON.stringify({ pageData: { again: true } }))
    wrapper = mount(<Test lazy="/data" />)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        expect(values).toHaveLength(2)
        expect(values[0]).toEqual({ loading: true, pageData: {} })
        expect(values[1]).toEqual({ loading: false, pageData: { again: true } })
        resolve()
      }, 100)
    })
  })

  it('should record lazy pageData in history when navigating', () => {
    global.fetch.mockResponseOnce(JSON.stringify({ pageData: { lazy: true } }))
    wrapper = mount(<Test lazy="/data" />)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        navigate('/next')
        goBack()
      }, 100)
      setTimeout(() => {
        expect(window.history.state).toEqual({ as: '/', rsf: { '/': { lazy: true } } })
        resolve()
      }, 200)
    })
  })

  it('should record eager pageData in history when navigating', () => {
    wrapper = mount(<Test pageData={{ eager: true }} />)

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        navigate('/next')
        goBack()
      }, 100)
      setTimeout(() => {
        expect(window.history.state).toEqual({ as: '/', rsf: { '/': { eager: true } } })
        resolve()
      }, 200)
    })
  })

  it('should not record pageData when going back', () => {
    navigate('/previous')
    navigate('/next')

    return new Promise((resolve, reject) => {
      setTimeout(() => {
        wrapper = mount(<Test pageData={{ x: 'y' }} />)
        goBack()
      }, 100)

      setTimeout(() => {
        expect(window.history.state).toEqual(null)
        resolve()
      }, 200)
    })
  })

  it('should update the store if lazy prop changes', () => {
    return new Promise((resolve, reject) => {
      global.fetch.mockResponseOnce(JSON.stringify({ pageData: { value: 1 } }))
      wrapper = mount(<Test lazy="/data/1" />)

      setTimeout(() => {
        global.fetch.mockResponseOnce(JSON.stringify({ pageData: { value: 2 } }))
        wrapper.setProps({ lazy: '/data/2' })
      }, 100)

      setTimeout(() => {
        expect(values).toHaveLength(4)
        expect(values[3]).toEqual({ loading: false, pageData: { value: 2 } })
        resolve()
      }, 200)
    })
  })

  it('should not update the store if eager props change', () => {
    wrapper = mount(<Test value={1} lazy="/data/1" />)
    wrapper.setProps({ value: 2, lazy: '/data/1' })
    expect(values).toHaveLength(2)
    expect(values[1].value).toBe(1)
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
