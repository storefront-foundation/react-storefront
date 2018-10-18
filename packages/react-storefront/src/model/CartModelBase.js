/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, clone, detach } from "mobx-state-tree"
import ProductModelBase from './ProductModelBase'

/**
 * A base model for the shopping cart that automatically fires added_to_cart and removed_from_cart analytics events
 */
const CartModelBase = types
  .model("CartModelBase", {
    items: types.optional(types.array(ProductModelBase), [])
  })
  .views(self => ({
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
     * @param {ProductModelBase} product 
     */
    add(product) {
      self.items.push(clone(product))
    },
    /**
     * Removes a product from the cart
     * @param {ProductModelBase} product 
     */
    remove(product) {
      detach(product)
    }
  }))

export default CartModelBase 