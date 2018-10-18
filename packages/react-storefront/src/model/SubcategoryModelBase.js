/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from "mobx-state-tree"
import SearchResultsModelBase from './SearchResultsModelBase'

const SubcategoryModelBase = types.compose(SearchResultsModelBase, 
  types.model("SubcategoryModelBase", {
    id: types.identifier(types.string),
    url: types.maybe(types.string),
    name: types.maybe(types.string),
    description: types.maybe(types.string)
  })
  .views(self => ({
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Subcategory'
    }
  }))
)

export default SubcategoryModelBase
