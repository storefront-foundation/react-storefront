/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'
import { MenuModel } from '../Menu'
import { TabsModel } from '../NavTabs'
import CategoryModelBase from './CategoryModelBase'
import SubcategoryModelBase from './SubcategoryModelBase'
import ProductModelBase from './ProductModelBase'
import UserModelBase from './UserModelBase'
import CartModelBase from './CartModelBase'
import SearchModelBase from './SearchModelBase'
import isEqual from 'lodash/isEqual'

/**
 * Represents a single breadcrumb
 */
export const BreadcrumbModel = types.model('BreadcrumbModel', {
  /**
   * The URL to link to
   */
  url: types.maybeNull(types.string),

  /**
   * The text for the link
   */
  text: types.string,

  /**
   * An object to be applied to the state tree when the breadcrumb is clicked.  The shape should match your AppModel class.
   */
  state: types.frozen()
})

export const LocationModel = types
  .model({
    protocol: 'https',
    hostname: types.maybeNull(types.string),
    pathname: types.string,
    search: types.string,
    port: '443'
  })
  .views(self => ({
    get urlBase() {
      return (
        // Since protocols sometimes have a colon at the end, we remove it if it exists and add it back manually
        self.protocol.replace(/:/, '') +
        '://' +
        self.hostname +
        (['443', '80'].includes(self.port) ? '' : `:${self.port}`)
      )
    }
  }))

const AppModelBase = types
  .model('AppModelBase', {
    amp: false,
    offline: false,
    initialWidth: 'xs',
    page: types.maybeNull(types.string),
    title: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    loading: false,
    error: types.maybeNull(types.string),
    stack: types.maybeNull(types.string),
    menu: types.optional(MenuModel, {}),
    tabs: types.maybeNull(TabsModel),
    category: types.maybeNull(CategoryModelBase),
    subcategory: types.maybeNull(SubcategoryModelBase),
    product: types.maybeNull(ProductModelBase),
    loadingProduct: types.maybeNull(ProductModelBase),
    loadingSubcategory: types.maybeNull(SubcategoryModelBase),
    loadingCategory: types.maybeNull(CategoryModelBase),
    user: types.maybeNull(UserModelBase),
    location: types.maybeNull(LocationModel),
    search: types.optional(SearchModelBase, {}),
    breadcrumbs: types.optional(types.array(BreadcrumbModel), []),
    cart: types.optional(CartModelBase, {})
  })
  .views(self => ({
    get canonicalURL() {
      const { protocol, hostname, pathname, search } = self.location
      return protocol + '//' + hostname + pathname.replace(/\.amp$/, '') + search
    },
    get uri() {
      return self.location.pathname + self.location.search
    }
  }))
  .actions(self => ({
    /**
     * Clears the thumbnail being injected into the product skeleton
     */
    clearProductThumbnail() {
      self.productThumbnail = null
    },

    /**
     * Applies a patch to the state tree
     * @param {Object} patch The patch to apply
     * @param {String} action "PUSH", "POP", or "REPLACE"
     */
    applyState(patch, action) {
      if (action === 'POP') {
        // the user clicked the browser's back button
        patch = self.retainStateOnHistoryPop(patch) // ensure that state not corresponding to the URL is retained, for example the user and cart
        auditPatchOnPop(self, patch) // ensure that data for other pages is not changed.  This minimizes component reconciliation to boost performance

        if (patch.hasOwnProperty('page')) {
          self.page = patch.page // apply the page change first so the UI swaps to the previous page immediately
        }

        self.loading = false // if we're still loading the current page, we can hide the load mask immediately because we're going back to the previous page
        setImmediate(() => self.applyState(patch)) // apply the rest of the state change
      } else {
        // all other navigation
        const state = self.toJSON()

        for (let key in patch) {
          const value = patch[key]

          if (!isEqual(value, state[key])) {
            self[key] = value
          }
        }
      }
    },

    /**
     * Set connection status
     */
    setOffline(offline) {
      self.offline = offline
    },

    /**
     * Returns the part of the state tree which should not be overwritten
     * when the user goes forward or back.  You can override this action
     * to retain additional branches of the tree.
     */
    retainStateOnHistoryPop(patch) {
      delete patch.cart
      delete patch.user
      delete patch.menu
      delete patch.tabs
      return patch
    },

    /**
     * Sets the user model
     * @param {UserModelBase} user
     */
    signIn(user) {
      self.user = user
    },

    /**
     * Cleares the user model
     */
    signOut() {
      self.user = null
    },

    /**
     * Restores the user identity
     * @param {UserModelBase} user
     */
    setUser(user) {
      self.user = user
    },

    /**
     * Displays an error state
     * @param {Error} e
     */
    onError(e) {
      self.page = 'Error'
      self.error = e.message
      self.stack = e.stack
    }
  }))

/**
 * Removes values from the patch corresponding to existing values in the model that
 * implement forPage and for which forPage does not match the page being set in the patch.
 *
 * This helps minimize react component reconciliation by ensuring that values corresponding to
 * hidden pages are not changed when navigating back.
 *
 * @param {AppModelBase} model The app model instance
 * @param {Object} patch The patch to be applied
 */
function auditPatchOnPop(model, patch) {
  if (patch.page) {
    for (let key in patch) {
      const current = model[key]

      if (current && current.shouldApplyPatchOnPop && !current.shouldApplyPatchOnPop(patch)) {
        delete patch[key]
      }
    }
  }
}

export default AppModelBase
