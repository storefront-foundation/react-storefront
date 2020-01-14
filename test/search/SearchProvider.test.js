import React, { useContext } from 'react'
import { mount } from 'enzyme'
import SearchProvider from 'react-storefront/search/SearchProvider'
import SearchContext from 'react-storefront/search/SearchContext'
import * as useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'
import { StaleResponseError } from 'react-storefront/utils/fetchLatest'
import { act } from 'react-dom/test-utils'

describe('SearchProvider', () => {
  let wrapper, context, navigationSpy

  beforeEach(() => {
    navigationSpy = jest.spyOn(useNavigationEvent, 'default').mockImplementation(options => options)
  })

  afterEach(() => {
    wrapper.unmount()
    fetch.resetMocks()
    jest.restoreAllMocks()
    context = undefined
  })

  const ContextGetter = () => {
    context = useContext(SearchContext)

    return null
  }

  it('should call navigation event and context should provide onClose', async () => {
    fetch.mockResponseOnce(JSON.stringify({}))
    const onCloseMock = jest.fn()

    wrapper = mount(
      <SearchProvider onClose={onCloseMock}>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await sleep(250) // to trigger debounce
      await wrapper.update()
    })

    expect(navigationSpy).toHaveBeenCalledWith(onCloseMock)
    expect(context.onClose).toBe(onCloseMock)
    act(() => {
      context.onClose()
    })
    expect(onCloseMock).toHaveBeenCalled()
  })

  it('should fetch suggestions', async () => {
    fetch.mockResponseOnce(JSON.stringify({ groups: 'test' }))

    wrapper = mount(
      <SearchProvider>
        <ContextGetter />
      </SearchProvider>,
    )

    await act(async () => {
      await sleep(250) // to trigger debounce
      await wrapper.update()
    })

    expect(context.state.groups).toBe('test')
  })

  it('should catch fetch errors and set loading to false', async () => {
    fetch.mockRejectOnce(new Error('test error'))

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
    fetch.mockRejectOnce(new StaleResponseError('test error'))

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
