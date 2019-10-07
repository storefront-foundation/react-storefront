/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'

export default types
  .model('Navigation', {
    /**
     * @private
     * Will be `true` when the user has navigated to a new page but the viewport
     * has not yet been scrolled back to the top.  This is used internally by
     * React Storefront to keep lazy components from detecting whether or not
     * they are below the fold before the scroll position is reset.
     */
    scrollResetPending: false,

    /**
     * @private
     * Set to `true` to prevent the app from scrolling to the top during navigation
     */
    preserveScroll: false
  })
  .actions(self => ({
    /**
     * Updates scrollResetPending
     * @private
     * @param {Boolean} pending The new value
     */
    setScrollResetPending(pending) {
      self.scrollResetPending = pending && !self.preserveScroll
    },

    /**
     * @private
     * Call to prevent the app from scrolling to the top during the next navigation.
     */
    preserveScrollOnNextNavigation() {
      self.preserveScroll = true
    },

    /**
     * @private
     * To be called after navigation is complete to reset scrollResetPending and preserveScroll.
     */
    finished() {
      self.scrollResetPending = false
      self.preserveScroll = false
    }
  }))
