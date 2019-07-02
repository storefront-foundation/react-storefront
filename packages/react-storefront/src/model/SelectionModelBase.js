/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, clone } from 'mobx-state-tree'
import OptionModelBase from './OptionModelBase'

/**
 * Represents a collection of selectable options.
 * @class SelectionModelBase
 */
const SelectionModelBase = types
  .model('SelectionModelBase', {
    /**
     * All available options.
     * @type {OptionModelBase[]}
     * @memberof SelectionModelBase
     * @instance
     */
    options: types.optional(types.array(OptionModelBase), []),
    /**
     * The selected option
     * @type {OptionModelBase}
     * @memberof SelectionModelBase
     * @instance
     */
    selected: types.maybeNull(OptionModelBase)
  })
  .actions(self => ({
    /**
     * Updates the selected option
     * @param {OptionModelBase} option The option to select
     * @memberof SelectionModelBase
     * @instance
     */
    setSelected(option) {
      if (option) {
        self.selected = clone(option)
      } else {
        self.selected = null
      }
    }
  }))

export default SelectionModelBase
