/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { types, clone } from 'mobx-state-tree'
import OptionModelBase from './OptionModelBase'

const SelectionModelBase = types
  .model('SelectionModelBase', {
    /**
     * All available options.
     */
    options: types.optional(types.array(OptionModelBase), []),
    /**
     * The selected option
     */
    selected: types.maybeNull(OptionModelBase),
  })
  .actions(self => ({
    /**
     * Updates the selected option
     * @param {OptionModelBase} option The option to select
     */
    setSelected(option) {
      if (option) {
        self.selected = clone(option)
      } else {
        self.selected = null
      }
    },
  }))

export default SelectionModelBase
