/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'
import SearchResultsModelBase from './SearchResultsModelBase'

const SubcategoryModelBase = types.compose(
  SearchResultsModelBase,
  types
    .model('SubcategoryModelBase', {
      id: types.identifier,
      url: types.maybeNull(types.string),
      name: types.maybeNull(types.string),
      description: types.maybeNull(types.string)
    })
    .views(self => ({
      shouldApplyPatchOnPop(patch) {
        return patch.page === 'Subcategory'
      }
    }))
)

export default SubcategoryModelBase
