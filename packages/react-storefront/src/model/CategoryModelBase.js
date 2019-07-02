/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'
import SubcategoryModelBase from './SubcategoryModelBase'

/**
 * A base model for category pages.
 *
 * Example:
 *
 * ```js
 *  // src/category/CategoryModel.js
 *  import { types } from 'mobx-state-tree'
 *  import CategoryModelBase from 'react-storefront/model/CategoryModelBase'
 *
 *  // Create the model for your category pages by extending CategoryModelBase.
 *  const CategoryModel = types.compose(
 *    CategoryModelBase,
 *    types
 *      .model('CategoryModel', {
 *        // your custom properties here
 *      })
 *  )
 *
 *  export default CategoryModel
 * ```
 *
 * @class CategoryModelBase
 */
const CategoryModelBase = types
  .model('CategoryModelBase', {
    /**
     * The id of the category as a string.
     * @type {String}
     * @memberof CategoryModelBase
     * @instance
     */
    id: types.identifier,
    /**
     * The URL for the category page.
     * @type {String}
     * @memberof CategoryModelBase
     * @instance
     */
    url: types.maybeNull(types.string),
    /**
     * The name of the category.
     * @type {String}
     * @memberof CategoryModelBase
     * @instance
     */
    name: types.maybeNull(types.string),
    /**
     * A description to display.
     * @type {String}
     * @memberof CategoryModelBase
     * @instance
     */
    description: types.maybeNull(types.string),
    /**
     * The subcategories to link to.
     * @type {SubcategoryModelBase[]}
     * @memberof CategoryModelBase
     * @instance
     */
    subcategories: types.optional(types.array(SubcategoryModelBase), [])
  })
  .views(self => ({
    /**
     * @private
     */
    shouldApplyPatchOnPop(patch) {
      return patch.page === 'Category'
    }
  }))

export default CategoryModelBase
