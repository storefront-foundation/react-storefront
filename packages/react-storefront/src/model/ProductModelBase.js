/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, onPatch } from "mobx-state-tree"
import SelectionModelBase from "./SelectionModelBase"

const ProductModelBase = types
  .model('ProductModelBase', {
    id: types.identifier(types.string),
    url: types.maybe(types.string),
    name: types.maybe(types.string),
    description: types.maybe(types.string),
    size: types.maybe(SelectionModelBase),
    color: types.maybe(SelectionModelBase),
    quantity: types.optional(types.number, 1),
    rating: types.maybe(types.number),
    reviewCount: types.maybe(types.number),
    basePrice: types.maybe(types.number),
    brand: types.maybe(types.string),
    images: types.optional(types.array(types.string), []),
    thumbnails: types.optional(types.array(types.string), []),
    thumbnail: types.maybe(types.string),
    loadingImages: false
  })
  .views(self => ({
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Product'
    },
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
     * Updates the quantity and fires an analytics event
     * @param {Number} quantity 
     */
    setQuantity(q) {
      self.quantity = q < 1 ? 1 : q
    },
    /**
     * Get images for the selected color
     */
    fetchImages() {
      const {pathname, search} = window.location
      const selected = self.color.selected
      self.loadingImages = true

      if (selected) {
        fetch(`${pathname}/images/${selected.id}.json${search}`)
          .then(res => res.json())
          .then(state => self.apply({ ...state, loadingImages: false }))
          .catch(() => self.apply({ loadingImages: false }))
      }
    },
    /**
     * Update the images based on the response from the images handler
     * @param {String[]} images 
     */
    apply(state) {
      Object.assign(self, state)
    }
  }))

export default ProductModelBase