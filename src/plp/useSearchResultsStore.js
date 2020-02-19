import useLazyState from '../hooks/useLazyState'

/**
 * Allows for using search results.
 * @param lazyProps
 * @return {*[]}
 */
export default function useSearchResultsStore(lazyProps) {
  const additionalData = {
    reloading: false,
    pageData: Object.freeze({
      page: 0,
      filters: [],
      sort: 'rating',
      sortSaved: 'rating',
      appliedFilters: [],
      sortOptions: [],
      filtersChanged: false,
    }),
  }

  return useLazyState(lazyProps, additionalData)
}
