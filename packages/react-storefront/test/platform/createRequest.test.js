/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import createRequest from '../../src/platform/createRequest'

describe('createRequest', () => {
  global.env = { 
    path: '/',
    host: 'localhost:80',
    headers: JSON.stringify({})
  }

  it('should warn when you access path', () => {
    console.warn = jest.fn()
    expect(createRequest().path).toBe('/')
    expect(console.warn).toHaveBeenCalledWith('warning: request.path is deprecated and will be removed in a future version of react-storefront')
  })
})