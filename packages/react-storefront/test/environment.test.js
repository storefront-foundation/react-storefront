import { isClient, isServer } from '../src/environment'

describe('environment', () => {
  let runtime

  beforeAll(() => {
    runtime = process.env.MOOV_RUNTIME
  })

  afterAll(() => {
    process.env.MOOV_RUNTIME = runtime
  })

  describe('isServer', () => {
    it('should return true when on the server', () => {
      process.env.MOOV_RUNTIME = 'server'
      expect(isServer()).toBe(true)
    })
    it('should return false when on the client', () => {
      process.env.MOOV_RUNTIME = 'client'
      expect(isServer()).toBe(false)
    })
  })

  describe('isClient', () => {
    it('should return false when on the server', () => {
      process.env.MOOV_RUNTIME = 'server'
      expect(isClient()).toBe(false)
    })
    it('should return true when on the client', () => {
      process.env.MOOV_RUNTIME = 'client'
      expect(isClient()).toBe(true)
    })
  })
})
