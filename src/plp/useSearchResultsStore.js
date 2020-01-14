import useLazyStore from '../hooks/useLazyStore'

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

  return useLazyStore(lazyProps, additionalData)
}
