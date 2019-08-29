const SmokeTestReporter = require('../smoke-test-reporter')
const fs = require('fs')

describe('SmokeTestReporter', () => {
  const reporter = new SmokeTestReporter()

  beforeAll(() => {
    fs.writeFile = jest.fn()
  })

  beforeEach(() => {
    jest.resetModules()
  })

  describe('onRunComplete', () => {
    it('should write test output to a file', async () => {
      const runResults = {
        numFailedTestSuites: 0,
        numFailedTests: 0,
        testResults: [
          {
            testResults: [
              { title: 'test1', status: 'skipped' },
              { title: 'test2', status: 'passed' }
            ]
          }
        ]
      }

      await reporter.onRunComplete(null, runResults, null)

      expect(fs.writeFile).toHaveBeenCalledWith(
        'test-result.json',
        JSON.stringify({
          status: 'passed',
          tests: `${reporter.markPassed} test1\n${reporter.markPassed} test2\n`
        })
      )
    })

    it('should write error message on failure', async () => {
      const runResults = {
        testResults: [
          {
            testResults: [
              { ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' },
              { ancestorTitles: ['smoke tests'], title: 'second test', status: 'failed' }
            ]
          }
        ]
      }

      await reporter.onRunComplete(null, runResults, null)

      expect(fs.writeFile).toHaveBeenCalledWith(
        'test-result.json',
        JSON.stringify({
          status: 'failed',
          tests: `${reporter.markFailed} first test\n${reporter.markFailed} second test\n`
        })
      )
    })
  })

  describe('allTestsPassed', () => {
    it('should return true if nothing failed', () => {
      const runResults = {
        numFailedTestSuites: 0,
        numFailedTests: 0
      }
      expect(reporter.allTestsPassed(runResults)).toEqual(true)
    })

    it('should return false if a test suite failed', () => {
      const runResults = {
        numFailedTestSuites: 1,
        numFailedTests: 0
      }
      expect(reporter.allTestsPassed(runResults)).toEqual(false)
    })

    it('should return false if a test failed', () => {
      const runResults = {
        numFailedTestSuites: 0,
        numFailedTests: 1
      }
      expect(reporter.allTestsPassed(runResults)).toEqual(false)
    })

    it('should return false if both failed', () => {
      const runResults = {
        numFailedTestSuites: 1,
        numFailedTests: 1
      }
      expect(reporter.allTestsPassed(runResults)).toEqual(false)
    })
  })
})
