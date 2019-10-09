/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'

/**
 * The mode that served the request. This can be used to identify under which mode a
 * request was served when running an A/B test.
 */
export default types.model('Mode', {
  /**
   * The id of the mode
   */
  id: types.frozen(types.string),
  /**
   * The name of the mode
   */
  name: types.frozen(types.maybeNull(types.string))
})
