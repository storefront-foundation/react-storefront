/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types } from "mobx-state-tree"

const UserModelBase = types
  .model("UserModelBase", {
    email: types.maybe(types.string)
  })

export default UserModelBase