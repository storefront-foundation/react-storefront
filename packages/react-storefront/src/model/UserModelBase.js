/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from 'mobx-state-tree'

/**
 * A base class for your `UserModel`.
 * @class UserModelBase
 */
const UserModelBase = types.model('UserModelBase', {
  /**
   * @type {String}
   * @memberof UserModelBase
   * @instance
   */
  email: types.maybeNull(types.string)
})

export default UserModelBase
