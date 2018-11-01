/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, isAlive, flow } from "mobx-state-tree"
import fetch from 'fetch'
import ProductModelBase from './ProductModelBase'

export const LAYOUT_LIST = 'LAYOUT_LIST'
export const LAYOUT_GRID = 'LAYOUT_GRID'

/**
 * A search facet that can be applied as a filter
 */
export const FacetModelBase = types.model('FacetModelBase', {
  /**
   * The value sent to the API when filtering
   */
  code: types.maybe(types.string),

  /**
   * The text displayed in the UI
   */
  name: types.identifier(types.string),

  /**
   * The number of items having the value
   */
  matches: types.maybe(types.number)
})

/**
 * A grouping of facets
 */
export const FacetGroupModelBase = types.model('FacetGroupModelBase', {
  /**
   * The text displayed in the UI
   */
  name: types.identifier(types.string),

  /**
   * The facets in the group
   */
  facets: types.optional(types.array(FacetModelBase), [])
})

/**
 * A value by which results can be sorted
 */
export const SortBase = types.model('SortBase', {
  /**
   * The code sent to the API when sorting
   */
  code: types.identifier(types.string),

  /**
   * The text displayed in the UI
   */
  name: types.maybe(types.string)
})

/**
 * A base class for search results and subcategories that supports filtering and sorting
 */
export default types
  .model('SearchResultsModelBase', {
    /**
     * The codes of the currently applied filters
     */
    filters: types.optional(types.array(types.string), []),

    /**
     * Automatically set to true when the user has changed a filter.  This causes
     * the filter dialog footer to be displayed.
     */
    filtersChanged: false,

    /**
     * Filters that can be selected
     */
    facetGroups: types.optional(types.array(FacetGroupModelBase), []),

    /**
     * The code for the currently selected sort option
     */
    sort: types.maybe(types.string),

    /**
     * Sort options that can be selected
     */
    sortOptions: types.optional(types.array(SortBase), []),

    /**
     * The total number of matching items. You can either specify numberOfPages or total to determine
     * when to display the Show More Button.  Only one is required.
     */
    total: types.maybe(types.number),

    /**
     * The total number of pages.  You can either specify numberOfPages or total to determine
     * when to display the Show More Button.  Only one is required.
     */
    numberOfPages: types.maybe(types.number),

    /**
     * The matching items
     */
    items: types.optional(types.array(ProductModelBase), []),

    /**
     * Set to true when loading more items from the server is in progress.
     */
    loadingMore: false,

    /**
     * The current page being displayed
     */
    page: 0,

    /**
     * The maximum number of records per page
     */
    pageSize: 10,

    /**
     * Sets the layout style on the view.  Can be LAYOUT_LIST or LAYOUT_GRID.  Defaults to LAYOUT_GRID.
     */
    layout: types.optional(types.enumeration('Layout', [LAYOUT_LIST, LAYOUT_GRID]), LAYOUT_GRID)
  })
  .views(self => ({
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
     */
    clearAllFilters() {
      self.filters.clear()
      self.filtersChanged = true
    },
    /**
     * Sets the filtersChanged field
     * @param {Boolean} changed 
     */
    setFiltersChanged(changed) {
      self.filtersChanged = changed
    },
    /**
     * Refreshes the search based on the current filters and sort and resets the page to 0.
     */
    refresh() {
      self.filtersChanged = false
      self.items = []
      self.showPage(0)
    },
    /**
     * Toggles a facet on or off.
     * @param {FacetModelBase} facet 
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
    showPage: async function(page) {
      self.page = page
      let { pathname, search } = window.location
      search += search.length ? '&': '?'
      search += `page=${self.page}`
      
      try {
        self.loadingMore = true
        const results = await fetch(self.getShowMoreURL(`${pathname}.json${search}`)).then(res => res.json())
        if (isAlive(self)) {
          self.addItems(results.items)
        }
      } catch (e) {
        if (isAlive(self)) {
          self.endLoadingMore()
        }
        throw e
      }
    },
    /**
     * Fetches the next page from the server.
     */
    showMore() {
      self.showPage(self.page + 1)
    },
    getShowMoreURL(defaultURL) {
      return defaultURL
    },
    /**
     * Hides the loading more spinner.
     */
    endLoadingMore() {
      self.loadingMore = false
    },
    /**
     * Adds more items to the results
     * @param {Array} items 
     */
    addItems(items) {
      if (Array.isArray(items)) {
        self.items = [...self.items, ...items]
      }
      self.endLoadingMore()
    },
    /**
     * Toggles the layout
     * @param {String} layout LAYOUT_LIST or LAYOUT_GRID
     */
    switchLayout(layout) {
      self.layout = layout
    },
    /**
     * Sets the selected sort option
     */
    setSort(option) {
      self.sort = option.code
    }
  }))
