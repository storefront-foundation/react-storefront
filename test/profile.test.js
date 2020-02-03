import profile from 'react-storefront/profile'

describe('profile', () => {
  const originalLog = console.log
  const originalNodeEnv = process.env.NODE_ENV
  let mockLog

  beforeEach(() => {
    process.env.NODE_ENV = 'development'
    mockLog = console.log = jest.fn()
  })

  afterEach(() => {
    console.log = originalLog
    process.env.NODE_ENV = originalNodeEnv
  })

  describe('development', () => {
    it('should log the execution time', () => {
      profile('testing profile', () => {})
      expect(mockLog).toHaveBeenCalledWith('testing profile', expect.stringMatching(/.* ms/))
    })
  })

  describe('production', () => {
    beforeEach(() => {
      process.env.NODE_ENV = 'production'
    })

    it('should not log the execution time', () => {
      profile('testing profile', () => {})
      expect(mockLog).not.toHaveBeenCalled()
    })
  })
})
