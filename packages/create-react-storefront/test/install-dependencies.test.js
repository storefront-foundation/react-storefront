let installDependencies = require('../src/lib/install-dependencies')

describe('installDependencies', () => {
  describe('when install succeeds', () => {
    let originalConsoleLog, stdOut

    beforeEach(() => {
      stdOut = []
      originalConsoleLog = console.log
      console.log = msg => stdOut.push(msg)
      jest.mock('child_process', () => ({ execSync: jest.fn() }))
      jest.resetModules()
      installDependencies = require('../src/lib/install-dependencies')
    })

    afterEach(() => {
      console.log = originalConsoleLog
    })

    it('logs success', () => {
      installDependencies('path')
      expect(stdOut[1]).toContain('installed')
    })
  })

  describe('when install fails', () => {
    let mockErrorHandler

    beforeEach(() => {
      mockErrorHandler = jest.fn()
      jest.mock('../src/lib/handle-error', () => mockErrorHandler)

      jest.mock('child_process', () => ({
        execSync: () => {
          throw new Error('test')
        }
      }))

      jest.resetModules()
      installDependencies = require('../src/lib/install-dependencies')
    })

    it('calls handleError', () => {
      installDependencies('path')
      expect(mockErrorHandler).toHaveBeenCalled()
    })
  })
})
