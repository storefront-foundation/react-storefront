let SmokeTestReporter, fetch

describe('SmokeTestReporter', () => {
  beforeEach(() => {
    global.console = {
      log: jest.fn(),
      info: jest.fn(),
      error: jest.fn()
    }

    jest.resetModules()

    SmokeTestReporter = require('../smoke-test-reporter')
  })

  describe('onTestResult', () => {
    it('should not output on success', async () => {
      const testResult = {
        testResults: []
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(global.console.log).toHaveBeenCalledTimes(0)
    })

    it('should output first test failure', async () => {
      const testResult = {
        testResults: [
          { ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' },
          { ancestorTitles: ['smoke tests'], title: 'second test', status: 'failed' }
        ]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(global.console.log).toHaveBeenCalledWith('smoke tests failed with: first test')
    })

    it('should output second test failure', async () => {
      const testResult = {
        testResults: [
          { ancestorTitles: ['smoke tests'], title: 'first test', status: 'passed' },
          { ancestorTitles: ['smoke tests'], title: 'second test', status: 'failed' }
        ]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(global.console.log).toHaveBeenCalledWith('smoke tests failed with: second test')
    })
  })
})
