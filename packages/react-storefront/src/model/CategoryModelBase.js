/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'
import SubcategoryModelBase from './SubcategoryModelBase'

const CategoryModelBase = types
  .model('CategoryModelBase', {
    id: types.identifier,
    url: types.maybeNull(types.string),
    name: types.maybeNull(types.string),
    description: types.maybeNull(types.string),
    subcategories: types.optional(types.array(SubcategoryModelBase), [])
  })
  .views(self => ({
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Category'
    }
  }))

export default CategoryModelBase
