const { calculateReactStorefrontPath } = require('../src/lib/utils')
const path = require('path')

describe('calculateReactStorefrontPath', () => {
  describe('without creating a new directory', () => {
    it('returns process.cwd', () => {
      expect(
        calculateReactStorefrontPath('test', {
          createDirectory: false
        })
      ).toEqual(process.cwd())
    })
  })

  describe('while creating a new directory', () => {
    it('returns process.cwd plus the new directory name', () => {
      expect(
        calculateReactStorefrontPath('test', {
          createDirectory: true
        })
      ).toEqual(path.resolve(process.cwd(), 'test'))
    })
  })
})
