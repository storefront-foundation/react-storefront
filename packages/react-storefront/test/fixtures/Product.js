/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import ProductModelBase from '../../src/model/ProductModelBase'

export function createTestProduct(data = {}) {
  return ProductModelBase.create({
    id: 'id',
    name: 'name',
    brand: 'brand',
    selectedSize: { code: 'S' },
    selectedColor: { code: 'red' },
    ...data,
  })
}
