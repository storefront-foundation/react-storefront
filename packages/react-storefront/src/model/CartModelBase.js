/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, clone, detach } from 'mobx-state-tree'
import ProductModelBase from './ProductModelBase'

/**
 * @class CartModelBase
 * A base model for the shopping cart
 * @class CartModelBase
 */
const CartModelBase = types
  .model('CartModelBase', {
    /**
     * The products in the cart.
     * @type {ProductModelBase[]}
     * @memberof CartModelBase
     * @instance
     */
    items: types.optional(types.array(ProductModelBase), [])
  })
  .views(self => ({
    /**
     * The total number of items in the cart
     * @instance
     * @memberof CartModelBase
     * @returns {Number}
     */
    get quantity() {
      let total = 0
      for (let item of self.items) {
        total += item.quantity
      }
      return total
    }
  }))
  .actions(self => ({
    /**
     * Adds a product to the cart
     * @instance
     * @memberof CartModelBase
     * @param {ProductModelBase} product
     */
    add(product) {
      self.items.push(clone(product))
    },
    /**
     * Removes a product from the cart
     * @instance
     * @memberof CartModelBase
     * @param {ProductModelBase} product
     */
    remove(product) {
      detach(product)
    }
  }))

export default CartModelBase
