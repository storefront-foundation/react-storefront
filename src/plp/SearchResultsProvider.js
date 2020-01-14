import React, { useEffect } from 'react'
import SearchResultsContext from './SearchResultsContext'
import PropTypes from 'prop-types'
import qs from 'qs'
import replaceState from '../router/replaceState'

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
export default function SearchResultsProvider({ store, updateStore, children }) {
  useEffect(() => {
    setState({
      pageData: {
        ...store.pageData,
        appliedFilters: store.pageData.filters,
      },
    })
  }, [])

  const setState = state => {
    store = { ...store, ...state }
    updateStore(store)
  }

  /**
   * Fetches the next page of results
   */
  const fetchMore = () => {
    setState({
      pageData: {
        ...store.pageData,
        page: store.pageData.page + 1,
      },
    })

    return refresh()
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
    const { appliedFilters } = store.pageData
    const filtersChanged =
      JSON.stringify(filters.map(v => v.toLowerCase()).sort()) !==
      JSON.stringify(appliedFilters.map(v => v.toLowerCase()).sort())

    setState({
      pageData: {
        ...store.pageData,
        filters,
        filtersChanged,
      },
    })

    if (submit) {
      applyFilters()
    }
  }

  /**
   * Applies the selected filters, resets the page to 0 and fetches new results from the server.
   */
  const applyFilters = () => {
    setState({
      pageData: {
        ...store.pageData,
        filtersChanged: false,
        appliedFilters: [...store.pageData.filters],
        page: 0,
      },
    })

    refresh()
  }

  /**
   * Computes the query for the current state of the search controls
   */
  const getQueryForState = () => {
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

  /**
   * Fetches new results from the server
   * @param {Object} options
   */
  const refresh = async () => {
    const query = getQueryForState()
    const apiUrl = getURLForState(query)

    // Don't show page for user
    delete query.page
    replaceState(null, null, getURLForState(query))

    if (store.pageData.page === 0) {
      setState({ reloading: true })
    }

    const {
      pageData: { products },
    } = await fetch(`/api${apiUrl}`).then(res => res.json())

    setState({
      reloading: false,
      pageData: {
        ...store.pageData,
        products: store.pageData.page === 0 ? products : store.pageData.products.concat(products),
      },
    })
  }

  const setSort = option => {
    setState({
      pageData: {
        ...store.pageData,
        sort: option.code,
        page: 0,
      },
    })

    refresh()
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
        },
      }}
    >
      {children}
    </SearchResultsContext.Provider>
  )
}

SearchResultsProvider.propTypes = {
  /**
   * A store returned from `react-storefront/plp/useSearchResultsStore`.
   */
  store: PropTypes.object.isRequired,

  /**
   * The update function returned from `react-storefront/plp/useSearchResultsStore`.
   */
  updateStore: PropTypes.func.isRequired,
}
