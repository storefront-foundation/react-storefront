/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'
import SearchResultsModelBase from './SearchResultsModelBase'

/**
 * A base model for subcategory pages.
 *
 * Example:
 *
 * ```js
 *  // src/subcategory/SubcategoryModel.js
 *  import { types } from 'mobx-state-tree'
 *  import SubcategoryModelBase from 'react-storefront/model/SubcategoryModelBase'
 *
 *  // Create the model for your category pages by extending SubcategoryModelBase.
 *  const SubcategoryModel = types.compose(
 *    SubcategoryModelBase,
 *    types
 *      .model('SubcategoryModel', {
 *        // your custom properties here
 *      })
 *  )
 *
 *  export default SubcategoryModel
 * ```
 *
 * @class SubcategoryModelBase
 */
const SubcategoryModelBase = types.compose(
  SearchResultsModelBase,
  types
    .model('SubcategoryModelBase', {
      /**
       * The id of the subcategory.
       * @type {String}
       * @memberof SubcategoryModelBase
       * @instance
       */
      id: types.identifier,
      /**
       * The URL of the subcategory page.
       * @type {String}
       * @memberof SubcategoryModelBase
       * @instance
       */
      url: types.maybeNull(types.string),
      /**
       * The name of the subcategory.
       * @type {String}
       * @memberof SubcategoryModelBase
       * @instance
       */
      name: types.maybeNull(types.string),
      /**
       * The description of the subcategory.
       * @type {String}
       * @memberof SubcategoryModelBase
       * @instance
       */
      description: types.maybeNull(types.string)
    })
    .views(self => ({
      /**
       * @private
       * @param {Object} patch
       * @memberof SubcategoryModelBase
       * @instance
       */
      shouldApplyPatchOnPop(patch) {
        return patch.page === 'Subcategory'
      }
    }))
)

export default SubcategoryModelBase
