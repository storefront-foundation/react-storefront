/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { createTestProduct } from '../fixtures/Product'

describe('ProductModelBase', () => {

  let product

  beforeEach(() => {
    global.fetch.resetMocks()
    product = createTestProduct({
      color: {
        options: [
          { id: 'red', text: 'red' },
          { id: 'green', text: 'green' },
          { id: 'blue', text: 'blue' }
        ]
      }
    })
  })

  it('fetches images when the selected color changes', () => {
    global.fetch.mockResponse(
      JSON.stringify({
        images: ['/1.jpeg', '2.jpeg']
      })
    )

    product.color.setSelected(product.color.options[0])
    expect(product.loadingImages).toBe(true)

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(product.images).toEqual(['/1.jpeg', '2.jpeg'])
        expect(product.loadingImages).toBe(false)
        resolve()
      })
    })
  })

  it('should set loadingImages to false if the fetch call returns an error status', () => {
    global.fetch.mockResponse([
      JSON.stringify({ }),
      { status: 500 }
    ])

    product.color.setSelected(product.color.options[0])
    expect(product.loadingImages).toBe(true)

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(product.loadingImages).toBe(false)
        resolve()
      })
    })
  })

  it('should not fetch images if no color is selected', () => {
    product.color.setSelected(null)

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(global.fetch).not.toHaveBeenCalled()
        resolve()
      })
    })
  })

  it('sets the quantity', () => {
    product.setQuantity(10)
    expect(product.quantity).toBe(10)
  })

  it('should only apply a patch on pop if page === product', () => {
    expect(product.shouldApplyPatchOnPop({ page: 'Home' })).toBe(false)
    expect(product.shouldApplyPatchOnPop({ page: 'Product' })).toBe(true)
  })

  it('should apply new state', () => {
    product.apply({
      images: [ '/foo.jpeg' ]
    })
    expect(product.images).toEqual([ '/foo.jpeg' ])
  })

})
