/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { onSnapshot, applySnapshot } from 'mobx-state-tree'
import Storage from 'store2'

/**
 *  Example:
 *
 *  ```js
 *  import { persist } from 'path/to/persist'
 *
 *  export const ModelName = types
 *   .model('ModelName', {
 *     keyOne: 'includeMe',
 *     keyTwo: 'excludeMe'
 *   })
 *   .actions(self => ({
 *     afterCreate() {
 *       persist('storageName', self, {
 *         keyOne: true,
 *       })
 *     }
 *   }))
 * ```
 *
 * @param {String} name The name of the item in storage
 * @param {Model} store The mobx state tree model to store
 * @param {Object} schema OPTIONAL object of model keys, used to limit what gets stored - all keys stored by default
 */
export default function persist(name, store, schema = {}) {
  onSnapshot(store, _snapshot => {
    const snapshot = { ..._snapshot }
    // use only keys found in schema
    // if schema is empty store everything
    if (Object.keys(schema).length) {
      Object.keys(snapshot).forEach(key => {
        if (!schema[key]) {
          delete snapshot[key]
        }
      })
    }
    Storage.set(name, snapshot)
  })

  const snapshot = Storage.get(name)

  if (snapshot) {
    applySnapshot(store, snapshot)
  }
}
