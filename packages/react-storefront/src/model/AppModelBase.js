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
import NavigationModel from './NavigationModel'

/**
 * Represents a single breadcrumb
 * @class BreadcrumbModel
 */
export const BreadcrumbModel = types.model('BreadcrumbModel', {
  /**
   * The URL to link to
   * @type {String}
   * @memberof BreadcrumbModel
   * @instance
   */
  url: types.maybeNull(types.string),

  /**
   * The text for the link
   * @type {String}
   * @memberof BreadcrumbModel
   * @instance
   */
  text: types.string,

  /**
   * An object to be applied to the state tree when the breadcrumb is clicked.  The shape should match your AppModel class.
   * @type {Object}
   * @memberof BreadcrumbModel
   * @instance
   */
  state: types.frozen()
})

/**
 * Represents the browser's current location.
 * @class LocationModel
 */
export const LocationModel = types
  .model({
    /**
     * The protocol: "http" or "https".
     * @type {String}
     * @memberof LocationModel
     * @instance
     */
    protocol: 'https',
    /**
     * The hostname from the current URL.
     * @type {String}
     * @memberof LocationModel
     * @instance
     */
    hostname: types.maybeNull(types.string),
    /**
     * The path from the current URL.
     * @type {String}
     * @memberof LocationModel
     * @instance
     */
    pathname: types.string,
    /**
     * The search string from the current URL, including the leading "?".
     * @type {String}
     * @memberof LocationModel
     * @instance
     */
    search: types.string,
    /**
     * The port, typically '443'.
     * @type {String}
     * @memberof LocationModel
     * @instance
     */
    port: '443'
  })
  .views(self => ({
    /**
     * Returns the base URL for the site in the format {protocol}://{hostname}
     * @type {String}
     * @memberof LocationModel
     * @instance
     * @returns {String}
     */
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

/**
 * A base class for you to extend when creating your `AppModel`, which will serve
 * as the root of the app state tree.
 *
 * Example:
 *
 * ```js
 *  // src/AppModel.js
 *  import { types } from 'mobx-state-tree'
 *  import AppModelBase from 'react-storefront/model/AppModelBase'
 *
 *  // Create the model for your app's state tree by extending AppModelBase.
 *  const AppModel = types.compose(
 *    AppModelBase,
 *    types
 *      .model('AppModel', {
 *        // your custom properties here
 *      })
 *  )
 *
 *  export default AppModel
 * ```
 *
 * @class AppModelBase
 */
const AppModelBase = types
  .model('AppModelBase', {
    /**
     * @private
     */
    _navigation: types.optional(NavigationModel, {}),
    /**
     * Will be `true` when rendering AMP, otherwise `false`.
     * @type {Boolean}
     * @memberof AppModelBase
     * @instance
     */
    amp: false,
    /**
     * Will be `true` when the user has lost their internet connection, otherwise `false`.
     * @type {Boolean}
     * @memberof AppModelBase
     * @instance
     */
    offline: false,
    /**
     * The default width to use for responsive layouts when rendering on the server.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    initialWidth: 'xs',
    /**
     * The top-level page component to display.  The value should be one of the keys in the `components`
     * prop in your `<Pages>` element in `src/App.js`
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    page: types.maybeNull(types.string),
    /**
     * Sets the document title.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    title: types.maybeNull(types.string),
    /**
     * Sets the content for the `<meta name="description">` tag.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    description: types.maybeNull(types.string),
    /**
     * Will be `true` when the app is loading content from an AJAX request, otherwise `false`.
     * @type {Boolean}
     * @memberof AppModelBase
     * @instance
     */
    loading: false,
    /**
     * When an error occurs, this field will be populated with the error message.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    error: types.maybeNull(types.string),
    /**
     * When an error occurs, this field will be populated with the error stack trace as a string.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    stack: types.maybeNull(types.string),
    /**
     * State for the app's slide-in menu.
     * @type {MenuModel}
     * @memberof AppModelBase
     * @instance
     */
    menu: types.optional(MenuModel, {}),
    /**
     * State for the app's main navigation tabs.
     * @type {TabsModel}
     * @memberof AppModelBase
     * @instance
     */
    tabs: types.maybeNull(TabsModel),
    /**
     * State for a category page.
     * @type {CategoryModelBase}
     * @memberof AppModelBase
     * @instance
     */
    category: types.maybeNull(CategoryModelBase),
    /**
     * State for a subcategory page.
     * @type {SubcategoryModelBase}
     * @memberof AppModelBase
     * @instance
     */
    subcategory: types.maybeNull(SubcategoryModelBase),
    /**
     * State for a product page.
     * @type {ProductModelBase}
     * @memberof AppModelBase
     * @instance
     */
    product: types.maybeNull(ProductModelBase),
    /**
     * Partial state for the product being fetched from the back end.  Use this when
     * rendering the skeleton while loading a product from the server.
     * @type {ProductModelBase}
     * @memberof AppModelBase
     * @instance
     */
    loadingProduct: types.maybeNull(ProductModelBase),
    /**
     * Partial state for the subcategory being fetched from the back end.  Use this when
     * rendering the skeleton while loading a subcategory from the server.
     * @type {SubcategoryModelBase}
     * @memberof AppModelBase
     * @instance
     */
    loadingSubcategory: types.maybeNull(SubcategoryModelBase),
    /**
     * Partial state for the category being fetched from the back end.  Use this when
     * rendering the skeleton while loading a category from the server.
     * @type {CategoryModelBase}
     * @memberof AppModelBase
     * @instance
     */
    loadingCategory: types.maybeNull(CategoryModelBase),
    /**
     * State representing the logged in or anonymous user.
     * @type {UserModelBase}
     * @memberof AppModelBase
     * @instance
     */
    user: types.maybeNull(UserModelBase),
    /**
     * The browser's location
     * @type {LocationModel}
     * @memberof AppModelBase
     * @instance
     */
    location: types.maybeNull(LocationModel),
    /**
     * State for the search form and search results
     * @type {LocationModel}
     * @memberof AppModelBase
     * @instance
     */
    search: types.optional(SearchModelBase, {}),
    /**
     * URLs to display in the breadcrumbs
     * @type {BreadcrumbModel}
     * @memberof AppModelBase
     * @instance
     */
    breadcrumbs: types.optional(types.array(BreadcrumbModel), []),
    /**
     * The state of the cart
     * @type {CartModelBase}
     * @memberof AppModelBase
     * @instance
     */
    cart: types.optional(CartModelBase, {})
  })
  .views(self => ({
    /**
     * The `href` for the `<link rel="canonical">` tag.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    get canonicalURL() {
      const { protocol, hostname, pathname, search } = self.location
      return protocol + '//' + hostname + pathname.replace(/\.amp$/, '') + search
    },
    /**
     * The pathname and search from the current URL.
     * @type {String}
     * @memberof AppModelBase
     * @instance
     */
    get uri() {
      return self.location.pathname + self.location.search
    }
  }))
  .actions(self => ({
    /**
     * Clears the thumbnail being injected into the product skeleton
     * @memberof AppModelBase
     * @instance
     */
    clearProductThumbnail() {
      self.productThumbnail = null
    },

    /**
     * Applies a patch to the state tree.  The shape of the patch should match your `AppModel`.
     * @param {Object} patch The patch to apply
     * @param {String} action "PUSH", "POP", or "REPLACE".  Set to "POP" when navigating back, "REPLACE" when updating the state stored in `window.history` for the current URL, and "PUSH" when navigating forward.
     * @memberof AppModelBase
     * @instance
     */
    applyState(patch, action = 'PUSH') {
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
     * Set connection status.
     * @param {Boolean} offline Set to `true` when the user has lost their internet connection.
     * @memberof AppModelBase
     * @instance
     */
    setOffline(offline) {
      self.offline = offline
    },

    /**
     * Returns the part of the state tree which should not be overwritten
     * when the user goes forward or back.  You can override this action
     * to retain additional branches of the tree.
     * @param {Object} patch The being applied in response to the user navigating back.
     * @returns {Object} A modified patch to apply to the state tree.
     * @memberof AppModelBase
     * @instance
     */
    retainStateOnHistoryPop(patch) {
      delete patch.cart
      delete patch.user
      delete patch.menu
      delete patch.tabs
      return patch
    },

    /**
     * Sets the user model.
     * @param {UserModelBase} user
     * @memberof AppModelBase
     * @instance
     */
    signIn(user) {
      self.user = user
    },

    /**
     * Clears the user model.
     * @memberof AppModelBase
     * @instance
     */
    signOut() {
      self.user = null
    },

    /**
     * Sets the user.
     * @param {UserModelBase} user
     * @memberof AppModelBase
     * @instance
     */
    setUser(user) {
      self.user = user
    },

    /**
     * Sets the `page` to "Error" and sets the `error` and `stack` properties based on
     * the provided `Error`.
     * @param {Error} e
     * @memberof AppModelBase
     * @instance
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
 * @private
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
