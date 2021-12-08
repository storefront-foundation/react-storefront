import React, { useEffect } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'
import SearchResultsContext from './SearchResultsContext'
import replaceState from '../router/replaceState'
import getAPIURL from '../api/getAPIURL'

/**
 * Provides context to filter, sorting, and pagination components.
 *
 * ```js
 *  import useSearchResultsStore from 'react-storefront/plp/useSearchResultsStore'
 *  import SearchResultsProvider from 'react-storefront/plp/SearchResultsProvider'
 *  import FilterButton from 'react-storefront/plp/FilterButton'
 *
 *  function Subcategory(lazyProps) {
 *    const [store, updateStore] = useSearchResultsStore(lazyProps)
 *
 *    return (
 *      <SearchResultsProvider store={store}>
 *        <FilterButton/>
 *      </SearchResultsProvider>
 *    )
 *  }
 * ```
 */
export default function SearchResultsProvider({ store, updateStore, queryForState, children }) {
  useEffect(() => {
    if (store.reloading) {
      const refresh = async function refresh() {
        const query = getQueryForState()
        const url = getURLForState(query)

        // Don't show page for user
        delete query.page
        replaceState(null, null, getURLForState(query))

        const {
          pageData: { products, total },
        } = await fetch(getAPIURL(url)).then(res => res.json())

        updateStore(store => ({
          reloading: false,
          pageData: {
            ...store.pageData,
            total,
            products:
              store.pageData.page === 0 ? products : store.pageData.products.concat(products),
          },
        }))
      }
      refresh()
    }
  }, [store])

  /**
   * Fetches the next page of results
   */
  const fetchMore = () => {
    updateStore(store => ({
      reloading: true,
      pageData: {
        ...store.pageData,
        page: store.pageData.page + 1,
      },
    }))
  }

  /**
   * Removes all filters
   * @param {Boolean} submit If true, fetches new results from the server
   */
  const clearFilters = submit => {
    setFilters([], submit)
  }

  /**
   * Switches the state of a filter
   * @param {Object} facet
   * @param {Boolean} submit If true, fetches new results from the server
   */
  const toggleFilter = (facet, submit) => {
    const { code } = facet
    const { filters } = store.pageData
    const nextFilters = [...filters]
    const index = nextFilters.indexOf(code)

    if (index === -1) {
      nextFilters.push(code)
    } else {
      nextFilters.splice(index, 1)
    }

    setFilters(nextFilters, submit)
  }

  /**
   * Updates the set of selected filters
   * @param {Object[]} filters
   * @param {Boolean} submit If true, fetches new results from the server
   */
  const setFilters = (filters, submit) => {
    const filtersChanged =
      JSON.stringify(filters.map(v => v.toLowerCase()).sort()) !==
      JSON.stringify(store.pageData.filters.map(v => v.toLowerCase()).sort())

    updateStore(store => ({
      reloading: Boolean(submit),
      pageData: {
        ...store.pageData,
        filters,
        filtersChanged: submit ? false : filtersChanged,
        page: submit ? 0 : store.pageData.page,
      },
    }))
  }

  /**
   * Applies the selected filters, resets the page to 0 and fetches new results from the server.
   */
  const applyFilters = () => {
    updateStore(store => ({
      reloading: true,
      pageData: {
        ...store.pageData,
        filtersChanged: false,
        page: 0,
      },
    }))
  }

  /**
   * Computes the query for the current state of the search controls
   */
  const getQueryForState = () => {
    if (queryForState) return queryForState(store.pageData)

    const { filters, page, sort } = store.pageData
    const { search } = window.location
    const query = qs.parse(search, { ignoreQueryPrefix: true })

    if (filters.length) {
      query.filters = JSON.stringify(filters)
    } else {
      delete query.filters
    }

    if (query.more) {
      delete query.more
    }

    if (page > 0) {
      query.page = page
    } else {
      delete query.page
    }

    if (sort) {
      query.sort = sort
    } else {
      delete query.sort
    }

    return query
  }

  /**
   * Computes the URL for the current query of the search controls
   */
  const getURLForState = query => {
    const { pathname, hash } = window.location
    return pathname + qs.stringify(query, { addQueryPrefix: true }) + hash
  }

  const setSort = option => {
    updateStore(store => ({
      reloading: true,
      pageData: {
        ...store.pageData,
        sort: option.code,
        page: 0,
      },
    }))
  }

  return (
    <SearchResultsContext.Provider
      value={{
        ...store,
        actions: {
          fetchMore,
          toggleFilter,
          clearFilters,
          applyFilters,
          setSort,
          setFilters,
        },
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  )
}

SearchResultsProvider.propTypes = {
  /**
   * A store returned from [`useSearchResultsStore`](/apiReference/plp/useSearchResultsStore).
   */
  store: PropTypes.object.isRequired,

  /**
   * The update function returned from [`useSearchResultsStore`](/apiReference/plp/useSearchResultsStore).
   */
  updateStore: PropTypes.func.isRequired,

  /**
   * An optional function to customize the URL format for search pages when the user
   * changes filters and sort.
   */
  queryForState: PropTypes.func,
}
