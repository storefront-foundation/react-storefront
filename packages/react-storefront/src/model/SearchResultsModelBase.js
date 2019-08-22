/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, isAlive, flow } from 'mobx-state-tree'
import fetch from 'fetch'
import ProductModelBase from './ProductModelBase'

/**
 * Displays results as a list
 * @type {String}
 */
export const LAYOUT_LIST = 'LAYOUT_LIST'

/**
 * Displays results as a grid
 * @type {String}
 */
export const LAYOUT_GRID = 'LAYOUT_GRID'

/**
 * A search facet that can be applied as a filter
 * @class FacetModelBase
 */
export const FacetModelBase = types.model('FacetModelBase', {
  /**
   * The value sent to the API when filtering.
   * @type {String}
   * @memberof FacetModelBase
   * @instance
   */
  code: types.maybeNull(types.string),

  /**
   * The text displayed in the UI.
   * @type {String}
   * @memberof FacetModelBase
   * @instance
   */
  name: types.identifier,

  /**
   * The number of items in the facet
   * @type {Number}
   * @memberof FacetModelBase
   * @instance
   */
  matches: types.maybeNull(types.number)
})

/**
 * A grouping of facets.
 * @class FacetGroupModelBase
 */
export const FacetGroupModelBase = types.model('FacetGroupModelBase', {
  /**
   * The text displayed in the UI.
   * @type {String}
   * @memberof FacetGroupModelBase
   * @instance
   */
  name: types.identifier,

  /**
   * The facets in the group.
   * @type {FacetModelBase[]}
   * @memberof FacetGroupModelBase
   * @instance
   */
  facets: types.optional(types.array(FacetModelBase), [])
})

/**
 * A value by which results can be sorted.
 * @class SortBase
 */
export const SortBase = types.model('SortBase', {
  /**
   * The code sent to the API when sorting
   * @type {String}
   * @memberof SortBase
   * @instance
   */
  code: types.identifier,

  /**
   * The text displayed in the UI
   * @type {String}
   * @memberof SortBase
   * @instance
   */
  name: types.maybeNull(types.string)
})

/**
 * A base class for search results and subcategories that supports filtering and sorting
 * @class SearchResultsModelBase
 */
export default types
  .model('SearchResultsModelBase', {
    /**
     * The codes of the currently applied filters
     * @type {String}
     * @memberof SearchResultsModelBase
     * @instance
     */
    filters: types.optional(types.array(types.string), []),

    /**
     * Automatically set to `true` when the user has changed a filter.  This causes
     * the filter dialog footer to be displayed.
     * @type {Boolean}
     * @memberof SearchResultsModelBase
     * @instance
     */
    filtersChanged: false,

    /**
     * Filters that can be selected.
     * @type {FacetGroupModelBase[]}
     * @memberof SearchResultsModelBase
     * @instance
     */
    facetGroups: types.optional(types.array(FacetGroupModelBase), []),

    /**
     * The code for the currently selected sort option
     * @type {String}
     * @memberof SearchResultsModelBase
     * @instance
     */
    sort: types.maybeNull(types.string),

    /**
     * Sort options that can be selected
     * @type {SortBase[]}
     * @memberof SearchResultsModelBase
     * @instance
     */
    sortOptions: types.optional(types.array(SortBase), []),

    /**
     * The total number of matching items. You can either specify numberOfPages or total to determine
     * when to display the Show More Button.  Only one is required.
     * @type {Number}
     * @memberof SearchResultsModelBase
     * @instance
     */
    total: types.maybeNull(types.number),

    /**
     * The total number of pages.  You can either specify numberOfPages or total to determine
     * when to display the Show More Button.  Only one is required.
     * @type {Number}
     * @memberof SearchResultsModelBase
     * @instance
     */
    numberOfPages: types.maybeNull(types.number),

    /**
     * The matching items
     * @type {ProductModelBase[]}
     * @memberof SearchResultsModelBase
     * @instance
     */
    items: types.optional(types.array(ProductModelBase), []),

    /**
     * Set to true when fetching data from the server in response to a filter or sort change.
     * @type {Boolean}
     * @memberof SearchResultsModelBase
     * @instance
     */
    loading: false,

    /**
     * Set to true when loading more items from the server is in progress.
     * @type {Boolean}
     * @memberof SearchResultsModelBase
     * @instance
     */
    loadingMore: false,

    /**
     * The current page being displayed
     * @type {Number}
     * @memberof SearchResultsModelBase
     * @instance
     */
    page: 0,

    /**
     * The maximum number of records per page
     * @type {Number}
     * @memberof SearchResultsModelBase
     * @instance
     */
    pageSize: 10,

    /**
     * Sets the layout style on the view.  Can be `LAYOUT_LIST` or `LAYOUT_GRID`.  Defaults to `LAYOUT_GRID`.
     * @type {String}
     * @memberof SearchResultsModelBase
     * @instance
     */
    layout: types.optional(types.enumeration('Layout', [LAYOUT_LIST, LAYOUT_GRID]), LAYOUT_GRID)
  })
  .views(self => ({
    /**
     * Will be `true` if there are more results to be displayed, otherwise `false`.
     * @type {Boolean}
     * @memberof SearchResultsModelBase
     * @instance
     */
    get hasMoreItems() {
      if (self.numberOfPages != null) {
        return self.numberOfPages - 1 > self.page
      } else if (self.total != null) {
        return self.total > self.items.length
      } else {
        return false
      }
    }
  }))
  .actions(self => ({
    /**
     * Removes all filters.
     * @memberof SearchResultsModelBase
     * @instance
     */
    clearAllFilters() {
      self.filters.clear()
      self.filtersChanged = true
    },
    /**
     * Sets the filtersChanged field.
     * @param {Boolean} changed
     * @memberof SearchResultsModelBase
     * @instance
     */
    setFiltersChanged(changed) {
      self.filtersChanged = changed
    },
    /**
     * Refreshes the search based on the current filters and sort and resets the page to 0.
     * @memberof SearchResultsModelBase
     * @instance
     */
    refresh: flow(function*() {
      self.filtersChanged = false
      self.loading = true
      yield self.showPage(0)
      self.loading = false
    }),
    /**
     * Toggles a facet on or off.
     * @param {FacetModelBase} facet
     * @memberof SearchResultsModelBase
     * @instance
     */
    toggleFilter(facet) {
      const { code } = facet
      const index = self.filters.indexOf(code)

      if (index === -1) {
        self.filters.push(code)
      } else {
        self.filters.splice(index, 1)
      }
      self.filtersChanged = true
    },
    /**
     * Fetches a page from the server
     * @param {Number} page The number of the page to fetch.
     * @memberof SearchResultsModelBase
     * @instance
     */
    showPage: async function(page) {
      self.page = page
      let { pathname, search } = window.location
      search += `${search.length ? '&' : '?'}page=${self.page}`

      try {
        self.loadingMore = page > 0
        const results = await fetch(self.getShowMoreURL(`${pathname}.json${search}`)).then(res =>
          res.json()
        )
        if (isAlive(self)) {
          self.addItems(results.items)
          self.setTotal(results.total)
          if (results.facetGroups) {
            self.setFacetGroups(results.facetGroups)
          }
        }
      } finally {
        if (isAlive(self)) {
          self.endLoadingMore()
        }
      }
    },
    /**
     * Fetches the next page from the server.
     * @memberof SearchResultsModelBase
     * @instance
     */
    showMore: async function() {
      if (!self.loading) {
        await self.showPage(self.page + 1)
      }
    },
    /**
     * @private
     * @param {String} defaultURL
     * @memberof SearchResultsModelBase
     * @instance
     */
    getShowMoreURL(defaultURL) {
      return defaultURL
    },
    /**
     * Hides the loading more spinner.
     * @memberof SearchResultsModelBase
     * @instance
     */
    endLoadingMore() {
      self.loadingMore = false
    },
    /**
     * Adds more items to the results.
     * @param {ProductModelBase[]} items
     * @memberof SearchResultsModelBase
     * @instance
     */
    addItems(items) {
      if (self.page === 0) {
        self.items = []
      }
      if (Array.isArray(items)) {
        self.items = [...self.items, ...items]
      }
      self.endLoadingMore()
    },
    /**
     * Sets the total number of matching records
     * @param {Integer} total
     * @memberof SearchResultsModelBase
     * @instance
     */
    setTotal(total) {
      self.total = total
    },
    /**
     * Sets the facet groups
     * @param {Array} facetGroups
     * @memberof SearchResultsModelBase
     * @instance
     */
    setFacetGroups(facetGroups) {
      self.facetGroups = facetGroups
    },
    /**
     * Toggles the layout
     * @param {String} layout LAYOUT_LIST or LAYOUT_GRID
     * @memberof SearchResultsModelBase
     * @instance
     */
    switchLayout(layout) {
      self.layout = layout
    },
    /**
     * Sets the selected sort option
     * @param {SortBase} option
     * @memberof SearchResultsModelBase
     * @instance
     */
    setSort(option) {
      self.sort = option.code
    }
  }))
