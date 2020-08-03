import React, { useContext } from 'react'
import { mount } from 'enzyme'
import SearchProvider from 'react-storefront/search/SearchProvider'
import SearchContext from 'react-storefront/search/SearchContext'
import { StaleResponseError } from 'react-storefront/utils/fetchLatest'
import { act } from 'react-dom/test-utils'

describe('SearchProvider', () => {
  let wrapper, context

  afterEach(() => {
    wrapper.unmount()
    fetchMock.resetMocks()
    jest.restoreAllMocks()
    context = undefined
  })

  const ContextGetter = () => {
    context = useContext(SearchContext)

    return null
  }

  it('should fetch suggestions if active is set to true', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ groups: 'test' }))

    wrapper = mount(
      <SearchProvider query={''}>
        <ContextGetter />
      </SearchProvider>,
    )

    expect(context.state.groups).toBe(undefined) // check that suggestions aren't fetched on mount

    await act(async () => {
      wrapper.setProps({ active: true })
      await sleep(300) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test') // check that suggestions are fetched only after active is set to true
  })

  it('should fetch suggestions if query is changed', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ groups: 'test' }))

    wrapper = mount(
      <SearchProvider query="" active>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await sleep(300) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test') // check that suggestions aren't fetched on mount

    fetchMock.mockResponseOnce(JSON.stringify({ groups: 'test2' }))

    await act(async () => {
      wrapper.setProps({ query: 'abc' })
      await sleep(300) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test2') // check that suggestions are fetched only after active is set to true
  })

  it('should not fetch suggestions if query length is less than minimum', async () => {
    fetchMock.mockResponseOnce(JSON.stringify({ groups: 'test' }))

    wrapper = mount(
      <SearchProvider query="" active>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await sleep(300) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test') // check that suggestions aren't fetched on mount

    fetchMock.mockResponseOnce(JSON.stringify({ groups: 'test2' }))

    await act(async () => {
      // Using a query less than default min length
      wrapper.setProps({ query: 'a' })
      await sleep(300) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test')
  })

  it('should catch fetch errors and set loading to false', async () => {
    fetchMock.mockRejectOnce(new Error('test error'))

    wrapper = mount(
      <SearchProvider initialGroups={[{}, {}]}>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await context.fetchSuggestions('')
      await sleep(250) // to trigger debounce

      await wrapper.update()
    })

    expect(context.state.loading).toBe(false)
  })

  it('should catch fetch Stale errors and not set loading to false', async () => {
    fetchMock.mockRejectOnce(new StaleResponseError('test error'))

    wrapper = mount(
      <SearchProvider initialGroups={[{}, {}]}>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await context.fetchSuggestions('')
      await sleep(250) // to trigger debounce

      await wrapper.update()
    })

    expect(context.state.loading).toBe(true)
  })
})
