/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import requestContext from '../src/requestContext'

describe('requestContext', () => {
  it('should return undefined from get if implementation was not set', () => {
    expect(requestContext.get('foo')).toEqual(undefined)
  })
  it('should not throw error if implementation was not set and set is called', () => {
    expect(() => {
      requestContext.set('foo')
    }).not.toThrow()
  })
})
