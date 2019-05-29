/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import fetch from 'fetch'
import debounce from 'lodash/debounce'
import { types } from 'mobx-state-tree'
import { fetchLatest, StaleResponseError } from '../fetchLatest'

// Ensures that responses are returned in order and that the previous request is canceled when a new request is sent.
const fetchSearchResults = fetchLatest(fetch)

/**
 * Represents an individual link within a group
 */
export const ResultsModel = types.model('ResultsModel', {
  /**
   * The link text
   */
  text: types.string,
  /**
   * The link's target url
   */
  url: types.string,
  /**
   * A url for a thumbnail image
   */
  thumbnail: types.maybeNull(types.string),
  /**
   * The thumbnail height
   */
  thumbnailHeight: 120,
  /**
   * The thumbnail width
   */
  thumbnailWidth: 120
})

/**
 * Represents a group of links withing the search results
 */
export const ResultsGroupModel = types
  .model('ResultsGroupModel', {
    /**
     * The caption to display at the top of the group
     */
    caption: types.string,
    /**
     * The list of links to display
     */
    results: types.optional(types.array(ResultsModel), [])
  })
  .views(self => ({
    get thumbnails() {
      return self.results.some(r => r.thumbnail != null)
    }
  }))

/**
 * The base model for site-wide searches.
 */
const SearchModelBase = types
  .model('SearchModelBase', {
    /**
     * The search phrase entered by the user
     */
    text: '',
    /**
     * The resulting groups
     */
    groups: types.optional(types.array(ResultsGroupModel), []),
    /**
     * True to show the loading spinner
     */
    loading: false,
    /**
     * True to show the search popup
     */
    show: false,
    /**
     * Minimum search text length for submission
     */
    minimumTextLength: 1
  })
  .actions(self => ({
    /**
     * Set `true` to show the search popup, `false` to hide.
     * @param {Boolean} show
     */
    toggle(show) {
      self.show = show
    },
    /**
     * Update the search text
     * @param {String} text
     */
    setText(text) {
      self.text = text
      if (self.text.trim().length >= self.minimumTextLength) {
        self.loading = true
        self.submit(text)
      } else {
        self.loading = false
      }
    },
    /**
     * Set `true` to show the loading spinner, `false` to hide.
     * @param {Boolean} state
     */
    setLoading(loading) {
      self.loading = loading
    },
    /**
     * Submit the search for the given keyword.  Fetched calls are automatically debounced and serialized so that
     * results are received in order.
     * @param {String} keyword
     */
    submit: debounce(async keyword => {
      if (!keyword) {
        return
      }

      try {
        const state = await fetchSearchResults(
          `/search/suggest.json?q=${encodeURIComponent(keyword)}`
        ).then(res => res.json())
        self.setGroups(state.search.groups)
        self.setLoading(false)
      } catch (e) {
        if (!StaleResponseError.is(e)) {
          self.setLoading(false)
          throw e
        }
      }
    }, 500),
    /**
     * Set the groups to be displayed
     * @param {ResultsGroupModel[]} groups
     */
    setGroups(groups) {
      self.groups = groups
    }
  }))

export default SearchModelBase
