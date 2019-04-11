/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import CategoryModelBase from '../../src/model/CategoryModelBase'

describe('CategoryModelBase', () => {
  it('should only apply a patch on pop if page === product', () => {
    const category = CategoryModelBase.create({ id: '1' })
    expect(category.shouldApplyPatchOnPop({ page: 'Home' })).toBe(false)
    expect(category.shouldApplyPatchOnPop({ page: 'Category' })).toBe(true)
  })
})
