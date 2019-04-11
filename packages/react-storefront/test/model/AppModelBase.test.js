/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import AppModelBase from '../../src/model/AppModelBase'

describe('AppModelBase', () => {
  it('should provide a canonical url for amp pages', () => {
    const app = AppModelBase.create({
      location: {
        pathname: '/foo.amp',
        search: '?bar=1',
        hostname: 'localhost',
        protocol: 'https:',
      },
    })

    expect(app.canonicalURL).toBe('https://localhost/foo?bar=1')
  })

  describe('uri', () => {
    it('should include hostname and search', () => {
      expect(
        AppModelBase.create({
          location: { protocol: 'https', pathname: '/foo', search: '?bar=true' },
        }).uri,
      ).toBe('/foo?bar=true')
    })
  })

  describe('productThumbnail', () => {
    it('should be cleared by clearProductThumbnail', () => {
      const app = AppModelBase.create({ productThumbnail: '/foo' })
      app.clearProductThumbnail()
      expect(app.productThumbnail).toBe(null)
    })
  })

  describe('applyState', () => {
    it('should retain cart and user when action = POP', () => {
      const app = AppModelBase.create({
        user: {
          email: 'user@domain.com',
        },
        cart: {
          items: [{ id: '1' }],
        },
      })

      const user = app.user.toJSON()
      const cart = app.cart.toJSON()

      app.applyState({ loading: false }, 'POP')

      expect(app.user.toJSON()).toEqual(user)
      expect(app.cart.toJSON()).toEqual(cart)
    })

    it('should apply all props when action is omitted', () => {
      const app = AppModelBase.create({
        user: {
          email: 'user@domain.com',
        },
        loading: false,
      })

      app.applyState({ loading: true, user: null })

      expect(app.user).toBeNull()
      expect(app.loading).toBe(true)
    })
  })
})
