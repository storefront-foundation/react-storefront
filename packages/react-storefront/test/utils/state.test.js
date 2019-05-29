import { lazyState, parseState } from '../../src/utils/state'

describe('state', () => {
  describe('lazyState', () => {
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