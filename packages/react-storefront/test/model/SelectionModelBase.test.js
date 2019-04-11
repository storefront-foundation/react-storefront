/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import SelectionModelBase from '../../src/model/SelectionModelBase'

describe('SelectionModelBase', () => {
  describe('setSelected', () => {
    it('should updated the selected value', () => {
      const model = SelectionModelBase.create({
        options: [{ id: '1', text: 'One' }, { id: '2', text: 'Two' }, { id: '3', text: 'Three' }],
        selected: { id: '2', text: 'Two' },
      })

      model.setSelected(model.options[0])

      expect(model.selected).toEqual(model.options[0])
    })
  })
})
