const path = require('path')

let { isTargetPathValid } = require('../src/lib/input-validation.js')

describe('inputValidation', () => {
  describe('when the path does not exist', () => {
    it('returns true', () => {
      expect(isTargetPathValid(path.resolve(__dirname, 'non-existent'))).toEqual(true)
    })
  })

  describe('when the path exists', () => {
    describe('when the path is a file', () => {
      it('returns false', () => {
        expect(
          isTargetPathValid(path.resolve(__dirname, 'test-artifacts', 'not-directory'))
        ).toEqual(false)
      })
    })

    describe('when the path is a directory', () => {
      describe('when the directory is empty', () => {
        it('returns true', () => {
          expect(
            isTargetPathValid(path.resolve(__dirname, 'test-artifacts', 'empty-directory'))
          ).toEqual(true)
        })
      })

      describe('when the directory is not empty', () => {
        it('returns false', () => {
          expect(
            isTargetPathValid(path.resolve(__dirname, 'test-artifacts', 'not-empty-directory'))
          ).toEqual(false)
        })
      })
    })
  })

  describe('on error', () => {
    let mockErrorHandler

    beforeEach(() => {
      mockErrorHandler = jest.fn()

      jest.mock('fs', () => ({
        existsSync: () => {
          throw new Error('fs error')
        }
      }))

      jest.mock('../src/lib/handle-error', () => mockErrorHandler)
      jest.resetModules()
      isTargetPathValid = require('../src/lib/input-validation.js').isTargetPathValid
    })

    it('calls handleError', () => {
      isTargetPathValid()
      expect(mockErrorHandler).toHaveBeenCalled()
    })
  })
})
