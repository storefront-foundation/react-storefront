/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from "mobx-state-tree"
import SubcategoryModelBase from './SubcategoryModelBase'

const CategoryModelBase = types
  .model("CategoryModelBase", {
    id: types.identifier(types.string),
    url: types.maybe(types.string),
    name: types.maybe(types.string),
    description: types.maybe(types.string),
    subcategories: types.optional(types.array(SubcategoryModelBase), [])
  })
  .views(self => ({
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Category'
    }
  }))

export default CategoryModelBase 