/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import createGenerateClassName from '../../src/utils/createGenerateClassName'

describe('createGenerateClassName', () => {
  let rule = {}
  let sheet = { options: { classNamePrefix: 'pwa' } }

  it('should generate short class names for amp', () => {
    const fn = createGenerateClassName({ amp: true })
    expect(fn(rule, sheet)).toBe('pwa0')
    expect(fn(rule, sheet)).toBe('pwa1')
  })

  it('should generate short class names in production', () => {
    const env = process.env.MOOV_ENV

    try {
      process.env.MOOV_ENV = 'production'
      const fn = createGenerateClassName({ amp: false })
      expect(fn(rule, sheet)).toBe('pwa0')
      expect(fn(rule, sheet)).toBe('pwa1')
    } finally {
      process.env.MOOV_ENV = env
    }
  })

  it('should use the material-ui default in development', () => {
    const fn = createGenerateClassName({ amp: false })
    const rule = {
      key: 'root'
    }
    const sheet = {
      options: {
        name: 'MyClass',
        classNamePrefix: 'RSF'
      }
    }
    expect(fn(rule, sheet)).toBe('RSF-MyClass-root-0')
  })
})
