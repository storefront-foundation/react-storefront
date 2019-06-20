import { lazyState, parseState } from '../../src/utils/state'

describe('state', () => {
  describe('lazyState', () => {
    it('should handle optional chaining', () => {
      const state = { age: 21 }
      expect(state?.person?.name).toEqual(undefined)
      expect(state?.age).toEqual(21)
    })
    it('should return a function that parses the provided JSON', () => {
      const state = { foo: 'bar' }
      const lazy = lazyState(JSON.stringify(state))
      expect(lazy()).toEqual(state)
    })
    it('should return the original object', () => {
      const state = { foo: 'bar' }
      const lazy = lazyState(state)
      expect(lazy).toEqual(state)
    })
  })
  describe('parseState', () => {
    it('should parses a string as JSON', () => {
      const state = { foo: 'bar' }
      const result = parseState(JSON.stringify(state))
      expect(result).toEqual(state)
    })
    it('should return the provided object', () => {
      const state = { foo: 'bar' }
      const result = parseState(state)
      expect(result).toBe(state)
    })
  })
})
