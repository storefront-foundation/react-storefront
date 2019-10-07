import NavigationModel from '../../src/model/NavigationModel'

describe('NavigationModel', () => {
  let model

  beforeEach(() => {
    model = NavigationModel.create()
  })

  describe('setScrollResetPending', () => {
    it('should set scrollResetPending', () => {
      expect(model.scrollResetPending).toBe(false)
      model.setScrollResetPending(true)
      expect(model.scrollResetPending).toBe(true)
      model.setScrollResetPending(false)
      expect(model.scrollResetPending).toBe(false)
    })
    it('should not set scrollResetPending to true if preserveScroll is true', () => {
      model.preserveScrollOnNextNavigation()
      model.setScrollResetPending(true)
      expect(model.scrollResetPending).toBe(false)
    })
  })

  describe('finished', () => {
    it('should set scrollResetPending to false', () => {
      model.setScrollResetPending(true)
      expect(model.scrollResetPending).toBe(true)
      model.finished()
      expect(model.scrollResetPending).toBe(false)
    })
    it('should set preserveScroll to false', () => {
      model.preserveScrollOnNextNavigation()
      expect(model.preserveScroll).toBe(true)
      model.finished()
      expect(model.preserveScroll).toBe(false)
    })
  })
})
