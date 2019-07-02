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
 * @class ResultsModel
 */
export const ResultsModel = types.model('ResultsModel', {
  /**
   * The link text
   * @type {String}
   * @memberof ResultsModel
   * @instance
   */
  text: types.string,
  /**
   * The link's target url
   * @type {String}
   * @memberof ResultsModel
   * @instance
   */
  url: types.string,
  /**
   * A url for a thumbnail image
   * @type {String}
   * @memberof ResultsModel
   * @instance
   */
  thumbnail: types.maybeNull(types.string),
  /**
   * The thumbnail height
   * @type {Number}
   * @memberof ResultsModel
   * @instance
   */
  thumbnailHeight: 120,
  /**
   * The thumbnail width
   * @type {Number}
   * @memberof ResultsModel
   * @instance
   */
  thumbnailWidth: 120
})

/**
 * Represents a group of links withing the search results
 * @class ResultsGroupModel
 */
export const ResultsGroupModel = types
  .model('ResultsGroupModel', {
    /**
     * The caption to display at the top of the group
     * @type {String}
     * @memberof ResultsGroupModel
     * @instance
     */
    caption: types.string,
    /**
     * The list of links to display
     * @type {ResultsModel[]}
     * @memberof ResultsGroupModel
     * @instance
     */
    results: types.optional(types.array(ResultsModel), [])
  })
  .views(self => ({
    /**
     * Will be `true` if any result in the group has a thumbnail, otherwise `false`.
     * @type {Boolean}
     * @memberof ResultsGroupModel
     * @instance
     */
    get thumbnails() {
      return self.results.some(r => r.thumbnail != null)
    }
  }))

/**
 * The base model for the search feature.
 * @class SearchModelBase
 */
const SearchModelBase = types
  .model('SearchModelBase', {
    /**
     * The search phrase entered by the user.
     * @type {String}
     * @memberof SearchModelBase
     * @instance
     */
    text: '',
    /**
     * The resulting groups.
     * @type {ResultsGroupModel[]}
     * @memberof SearchModelBase
     * @instance
     */
    groups: types.optional(types.array(ResultsGroupModel), []),
    /**
     * Result groups to display when the search field is blank
     * @type {Boolean}
     * @memberof SearchModelBase
     * @instance
     */
    initialGroups: types.optional(types.array(ResultsGroupModel), []),
    /**
     * Controls whether or not the loading spinner is displayed.
     * @type {Boolean}
     * @memberof SearchModelBase
     * @instance
     */
    loading: false,
    /**
     * Controls whether or not the search drawer is displayed.
     * @type {Boolean}
     * @memberof SearchModelBase
     * @instance
     */
    show: false,
    /**
     * Minimum search text length for submission.  The app will only fetch results from the
     * server when the search text exceeds this length.
     * @type {Number}
     * @memberof SearchModelBase
     * @instance
     */
    minimumTextLength: 1
  })
  .views(self => ({
    /**
     * Returns the results to display, which will be the `initialGroups` when the search field is blank,
     * and `groups` when a search query has been entered.
     */
    get results() {
      const trimmed = self.text.trim()

      if (trimmed.length) {
        return self.groups
      } else {
        return self.initialGroups
      }
    }
  }))
  .actions(self => ({
    /**
     * Set `true` to show the search popup, `false` to hide.
     * @param {Boolean} show
     * @memberof SearchModelBase
     * @instance
     */
    toggle(show) {
      self.show = show
    },
    /**
     * Updates the search text.
     * @param {String} text
     * @memberof SearchModelBase
     * @instance
     */
    setText(text) {
      const trimmed = text.trim()

      self.text = text

      if (trimmed.length >= self.minimumTextLength) {
        self.loading = true
        self.submit(trimmed)
      } else {
        self.loading = false
      }
    },
    /**
     * Pass `true` to show the loading spinner, `false` to hide.
     * @param {Boolean} loading
     * @memberof SearchModelBase
     * @instance
     */
    setLoading(loading) {
      self.loading = loading
    },
    /**
     * Submit the search for the given keyword.  Fetched calls are automatically debounced and serialized so that
     * results are received in order.
     * @param {String} keyword
     * @memberof SearchModelBase
     * @instance
     */
    submit: debounce(async keyword => {
      if (!keyword) {
        return
      }

      try {
        const state = await fetchSearchResults(
          `/search/suggest.json?q=${encodeURIComponent(keyword)}`
        ).then(res => res.json())

        // only display the results if the user hasn't changed the search text since the request was sent
        if (self.text.trim() === keyword) {
          self.setGroups(state.search.groups)
          self.setLoading(false)
        }
      } catch (e) {
        if (!StaleResponseError.is(e)) {
          self.setLoading(false)
          throw e
        }
      }
    }, 500),
    /**
     * Sets the groups to be displayed.
     * @param {ResultsGroupModel[]} groups
     * @memberof SearchModelBase
     * @instance
     */
    setGroups(groups) {
      self.groups = groups
    }
  }))

export default SearchModelBase
