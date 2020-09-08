import React, { useState, useContext } from 'react'
import { mount } from 'enzyme'
import SearchResultsProvider from 'react-storefront/plp/SearchResultsProvider'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import { act } from 'react-dom/test-utils'

describe('SearchResultsProvider', () => {
  const initialStore = {
    pageData: {
      test: 'test',
      page: 0,
      filters: ['blue'],
      products: [{ id: 'first' }],
      total: 50,
    },
  }
  let wrapper, context, getStore

  beforeEach(() => {
    window.__NEXT_DATA__ = {
      buildId: 'development',
    }
  })

  afterEach(() => {
    wrapper.unmount()
    context = undefined
    getStore = undefined
    delete window.__NEXT_DATA__
  })

  const Test = props => {
    const [store, updateStore] = useState(initialStore)

    const ContextGetter = () => {
      context = useContext(SearchResultsContext)
      getStore = store

      return null
    }

    return (
      <SearchResultsProvider store={store} updateStore={updateStore} {...props}>
        <ContextGetter />
      </SearchResultsProvider>
    )
  }

  describe('actions', () => {
    it('fetchMore', async () => {
      const products = [{ id: 'test' }]

      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products,
          },
        }),
      )
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.fetchMore()
        await wrapper.update()
      })

      expect(getStore.pageData.page).toBe(initialStore.pageData.page + 1)
      expect(getStore.pageData.products).toStrictEqual(
        initialStore.pageData.products.concat(products),
      )
    })

    it('toggleFilter - toggle new filter', async () => {
      const facet = { code: 'red' }

      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.toggleFilter(facet)
        await wrapper.update()
      })

      expect(getStore.pageData.filters).toStrictEqual(
        initialStore.pageData.filters.concat(facet.code),
      )
      expect(getStore.pageData.filtersChanged).toBe(true)
    })

    it('toggleFilter - toggle existing filter', async () => {
      const facet = { code: 'blue' }
      initialStore.pageData.filters = ['blue']

      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.toggleFilter(facet)
        await wrapper.update()
      })

      expect(getStore.pageData.filters).toStrictEqual([])
      expect(getStore.pageData.filtersChanged).toBe(true)
    })

    it('toggleFilter - with submit', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products: [],
          },
        }),
      )
      const facet = { code: 'red' }

      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.toggleFilter(facet, true)
        await wrapper.update()
      })

      expect(getStore.pageData.filters).toStrictEqual(['blue', 'red'])
      expect(getStore.pageData.filtersChanged).toBe(false)
      expect(fetch).toHaveBeenCalled()
    })

    it('clearFilters - without submit', async () => {
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.clearFilters()
        await wrapper.update()
      })

      expect(getStore.pageData.filters).toStrictEqual([])
    })

    it('clearFilters - with submit', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products: [],
          },
        }),
      )
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.clearFilters(true)
        await wrapper.update()
      })

      expect(getStore.pageData.filters).toStrictEqual([])
      expect(fetch).toHaveBeenCalled()
    })

    it('refresh - should always remove "more" query param if sees it', async () => {
      const windowSpy = jest.spyOn(global.window, 'location', 'get').mockReturnValue({
        search: '?more=1',
        hash: '',
        pathname: '/test',
        href: 'http://localhost',
      })
      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products: [],
          },
        }),
      )
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.clearFilters(true)
        await wrapper.update()
      })

      expect(fetch).toHaveBeenCalledWith('/api/test?__v__=development')

      windowSpy.mockRestore()
    })

    it('applyFilters', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products: [],
            total: 0,
          },
        }),
      )
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.applyFilters()
        await wrapper.update()
      })

      expect(getStore.pageData.filtersChanged).toBe(false)
      expect(getStore.pageData.page).toBe(0)
      expect(getStore.pageData.total).toBe(0)
      expect(fetch).toHaveBeenCalled()
    })

    it('setSort', async () => {
      fetchMock.mockResponseOnce(
        JSON.stringify({
          pageData: {
            products: [],
          },
        }),
      )
      wrapper = mount(<Test />)

      await act(async () => {
        await context.actions.setSort({ code: 'asc' })
        await wrapper.update()
      })

      expect(getStore.pageData.sort).toBe('asc')
      expect(fetch).toHaveBeenCalled()
    })
  })

  it('should use the query string returned by queryForState', async () => {
    fetchMock.mockResponseOnce(
      JSON.stringify({
        pageData: {
          products: [],
        },
      }),
    )

    let providedState

    const queryForState = state => {
      providedState = state
      return { foo: 'bar' }
    }

    wrapper = mount(<Test queryForState={queryForState} />)

    await act(async () => {
      await context.actions.toggleFilter({ code: 'red' }, true)
      await wrapper.update()
    })

    expect(providedState.filters).toEqual(['blue', 'red'])
    expect(fetch).toHaveBeenCalledWith('/api/test?foo=bar&__v__=development')
  })
})
