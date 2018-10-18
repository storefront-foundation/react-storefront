/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { price } from '../src/format'

describe('price', () => {
  it('should render USD with two decimals by default', () => {
    expect(price(10.99)).toEqual('$10.99')
  })

  it('should render a specific currency', () => {
    expect(price(10.99, { currency: 'EUR' })).toEqual('€10.99')
  })

  it('should render with no decimals', () => {
    expect(price(10, { decimals: 0 })).toEqual('$10')
  })

  it('should force with 2 decimals', () => {
    expect(price(10)).toEqual('$10.00')
  })
})