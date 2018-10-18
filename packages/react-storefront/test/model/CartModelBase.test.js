/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import CartModelBase from '../../src/model/CartModelBase'
import { createTestProduct } from '../fixtures/Product'

describe('CartModelBase', () => {
  let product, cart

  beforeEach(() => {
    product = createTestProduct()
    cart = CartModelBase.create()
  })

  it('should add a product to the cart', () => {
    cart.add(product)
    expect(cart.items.length).toBe(1)
    expect(cart.items[0].toJSON()).toEqual(product.toJSON())
  })

  it('should remove an item from the cart', () => {
    cart.add(product)
    cart.remove(cart.items[0])
    expect(cart.items.length).toBe(0)
  })

  it('should give the correct quantity', () => {
    cart.add(product)
    expect(cart.quantity).toBe(1)
    cart.add(createTestProduct({ quantity: 2 }))
    expect(cart.quantity).toBe(3)
  })
})
