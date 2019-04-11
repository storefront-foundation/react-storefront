/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import dataProps from '../../src/utils/dataProps'

describe('dataProps', () => {
  it('should only return props starting with data-', () => {
    expect(dataProps({ 'data-amp-id': '1', 'data-vars-foo': 'bar', id: '1' })).toEqual({
      'data-amp-id': '1',
      'data-vars-foo': 'bar',
    })
  })

  it('should return an empty object when there are no props starting with data-', () => {
    expect(dataProps({ foo: 'bar' })).toEqual({})
  })
})
