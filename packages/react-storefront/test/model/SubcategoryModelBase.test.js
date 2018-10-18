/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import SubcategroyModelBase from '../../src/model/SubcategoryModelBase'

describe('SubcategoryModelBase', () => {
  it('should only apply a patch on pop if page === product', () => {
    const subcategory = SubcategroyModelBase.create({ id: '1' })
    expect(subcategory.shouldApplyPatchOnPop({ page: 'Home' })).toBe(false)
    expect(subcategory.shouldApplyPatchOnPop({ page: 'Subcategory' })).toBe(true)
  })
})