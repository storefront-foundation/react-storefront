const mock = require('mock-require')

let installDependencies = require('../src/lib/install-dependencies')

describe('installDependencies', () => {
  afterEach(() => {
    mock.stopAll()
    installDependencies = mock.reRequire('../src/lib/install-dependencies')
  })

  describe('when install succeeds', () => {
    let originalConsoleLog, stdOut

    beforeEach(() => {
      stdOut = []

      originalConsoleLog = console.log
      console.log = msg => {
        stdOut.push(msg)
      }

      mock('child_process', {
        execSync: () => {}
      })

      installDependencies = mock.reRequire('../src/lib/install-dependencies')
    })

    afterEach(() => {
      console.log = originalConsoleLog
    })

    it('logs success', () => {
      installDependencies('path')
      expect(stdOut[1]).to.include('installed')
    })
  })

  describe('when install fails', () => {
    let handleErrorCalled

    beforeEach(() => {
      handleErrorCalled = false

      mock('../src/lib/handle-error', () => {
        handleErrorCalled = true
      })

      mock('child_process', {
        execSync: () => {
          throw 'error'
        }
      })

      installDependencies = mock.reRequire('../src/lib/install-dependencies')
    })

    afterEach(() => {
      mock.stopAll()
      installDependencies = mock.reRequire('../src/lib/install-dependencies')
    })

    it('calls handleError', () => {
      installDependencies('path')
      expect(handleErrorCalled).toEqual(true)
    })
  })
})
