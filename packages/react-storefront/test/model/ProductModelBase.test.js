/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { createTestProduct } from '../fixtures/Product'
import ProductModelBase from '../../src/model/ProductModelBase'
import * as fromServer from '../../src/router/fromServer'

describe('ProductModelBase', () => {
  let product

  beforeEach(() => {
    product = createTestProduct({
      id: 'foo',
      color: {
        options: [
          { id: 'red', text: 'red' },
          { id: 'green', text: 'green' },
          { id: 'blue', text: 'blue' }
        ]
      }
    })
  })

  it('fetches images using product URL', () => {
    const mockFetch = jest.fn(() => Promise.resolve({}))
    fromServer.fetch = mockFetch

    product.color.setSelected(product.color.options[0])
    product.fetchImages()

    expect(product.loadingImages).toBe(true)

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(mockFetch).toHaveBeenCalledWith('/images/foo/red.json')
        resolve()
      })
    })
  })

  it('should set loadingImages to false if the fetch call returns an error status', () => {
    const mockFetch = jest.fn(() => Promise.reject())
    fromServer.fetch = mockFetch

    product.color.setSelected(product.color.options[0])
    product.fetchImages()
    expect(product.loadingImages).toBe(true)

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(product.loadingImages).toBe(false)
        resolve()
      })
    })
  })

  it('should not fetch images if no color is selected', () => {
    const mockFetch = jest.fn()
    fromServer.fetch = mockFetch

    product.color.setSelected(null)
    product.fetchImages()

    return new Promise((resolve, reject) => {
      setImmediate(() => {
        expect(mockFetch).not.toHaveBeenCalled()
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
      images: ['/foo.jpeg']
    })
    expect(product.images).toEqual(['/foo.jpeg'])
  })

  it('should calculate price based on basePrice', () => {
    const product = createTestProduct({
      basePrice: 99.99
    })

    expect(product.price).toEqual(99.99)
  })

  it('should calculate price based on the selected size', () => {
    const product = createTestProduct({
      basePrice: 99.99,
      size: {
        selected: {
          id: '1',
          price: 109.99
        }
      }
    })

    expect(product.price).toEqual(109.99)
  })

  it('should accept URLs for images', () => {
    expect(() => {
      ProductModelBase.create({
        id: '1',
        images: ['product.png']
      })
    }).not.toThrowError()
  })

  it('should accept objects for images', () => {
    expect(() => {
      ProductModelBase.create({
        id: '1',
        images: [{ src: 'product.png', alt: 'product' }]
      })
    }).not.toThrowError()
  })

  it('should accept URLs for thumbnails', () => {
    expect(() => {
      ProductModelBase.create({
        id: '1',
        thumbnails: ['product.png']
      })
    }).not.toThrowError()
  })

  it('should accept objects for images', () => {
    expect(() => {
      ProductModelBase.create({
        id: '1',
        thumbnails: [{ src: 'product.png', alt: 'product' }]
      })
    }).not.toThrowError()
  })
})
