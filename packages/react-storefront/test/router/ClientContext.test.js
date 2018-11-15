import ClientContext from '../../src/router/ClientContext'

describe('ClientContext', () => {
  let context

  beforeEach(() => {
    context = new ClientContext()
  })

  describe('cacheOnClient', () => {
    it('should be default by default', () => {
      expect(context.clientCache).toBe('default')
    })

    it('should set force-cache when true is passed', () => {
      context.cacheOnClient(true)
      expect(context.clientCache).toBe('force-cache')
    })

    it('should set default when false is passed', () => {
      context.cacheOnClient(false)
      expect(context.clientCache).toBe('default')
    })

    it('should return the context', () => {
      expect(context.cacheOnClient(true)).toBe(context)
    })

    it('should throw an Error if no parameter is provided', () => {
      expect(() => context.cacheOnClient()).toThrow()
    })
  })
})