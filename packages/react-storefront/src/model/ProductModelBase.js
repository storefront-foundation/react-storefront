/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, onPatch } from 'mobx-state-tree'
import SelectionModelBase from './SelectionModelBase'
import MediaTypeModel from './MediaTypeModel'

/**
 * A base model for product pages.
 *
 * Example:
 *
 * ```js
 *  // src/category/ProductModel.js
 *  import { types } from 'mobx-state-tree'
 *  import ProductModelBase from 'react-storefront/model/ProductModelBase'
 *
 *  // Create the model for your category pages by extending CategoryModelBase.
 *  const ProductModel = types.compose(
 *    ProductModelBase,
 *    types
 *      .model('ProductModel', {
 *        // your custom properties here
 *      })
 *  )
 *
 *  export default ProductModel
 * ```
 *
 * @class ProductModelBase
 */
const ProductModelBase = types
  .model('ProductModelBase', {
    /**
     * The id of the product.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    id: types.identifier,
    /**
     * The id of the product.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    url: types.maybeNull(types.string),
    /**
     * The URL of the product page
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    name: types.maybeNull(types.string),
    /**
     * The description of the product.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    description: types.maybeNull(types.string),
    /**
     * The size selection.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    size: types.maybeNull(SelectionModelBase),
    /**
     * The color selection.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    color: types.maybeNull(SelectionModelBase),
    /**
     * The quantity selected by the user.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    quantity: types.optional(types.number, 1),
    /**
     * The product rating from 1-5.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    rating: types.maybeNull(types.number),
    /**
     * The number of reviews on which the rating is based.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    reviewCount: types.maybeNull(types.number),
    /**
     * The base price of the product.
     * @type {Number}
     * @memberof ProductModelBase
     * @instance
     */
    basePrice: types.maybeNull(types.number),
    /**
     * The brand name or code.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    brand: types.maybeNull(types.string),
    /**
     * The product images.
     * @type {String[] | MediaTypeModel}
     * @memberof ProductModelBase
     * @instance
     */
    images: types.array(types.union(types.string, MediaTypeModel)),
    /**
     * The thumbnail corresponding to each image.
     * @type {String[] | MediaTypeModel}
     * @memberof ProductModelBase
     * @instance
     */
    thumbnails: types.array(types.union(types.string, MediaTypeModel)),
    /**
     * The thumbnail of the product.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    thumbnail: types.maybeNull(types.string),
    /**
     * The currency code for the price.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    currencyCode: types.optional(types.string, 'USD'),
    /**
     * Set to `true` when images are loading, otherwise `false`.
     * @type {String}
     * @memberof ProductModelBase
     * @instance
     */
    loadingImages: false
  })
  .views(self => ({
    /**
     * @private
     * @param {Object} patch
     */
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Product'
    },
    /**
     * The price of the selected size.
     * @type {Number}
     * @memberof ProductModelBase
     * @instance
     */
    get price() {
      const size = self.size && self.size.selected

      if (size && size.price) {
        return size.price
      } else {
        return self.basePrice
      }
    }
  }))
  .actions(self => ({
    afterCreate() {
      onPatch(self, patch => {
        if (patch.path === '/color/selected') {
          // fetch images when a new color is selected
          self.fetchImages()
        }
      })
    },

    /**
     * Updates the quantity.
     * @param {Number} quantity The quantity to set
     * @memberof ProductModelBase
     * @instance
     */
    setQuantity(q) {
      self.quantity = q < 1 ? 1 : q
    },

    /**
     * Get images for the selected color
     * @memberof ProductModelBase
     * @instance
     */
    fetchImages() {
      const { pathname, search } = window.location
      const selected = self.color.selected
      self.loadingImages = true

      if (selected) {
        fetch(`${pathname}/images/${selected.id}.json${search}`)
          .then(res => res.json())
          .then(state => self.apply({ ...state, loadingImages: false }))
          .catch(e => {
            console.error(e)
            self.apply({ loadingImages: false })
          })
      }
    },
    /**
     * Update the images based on the response from the images handler
     * @private
     * @param {String[]} images
     * @memberof ProductModelBase
     * @instance
     */
    apply(state) {
      Object.assign(self, state)
    },
    /**
     * Override this method to late fetch personalized data from the server after a
     * product is displayed.
     * @memberof ProductModelBase
     * @instance
     */
    loadPersonalization() {}
  }))

export default ProductModelBase
