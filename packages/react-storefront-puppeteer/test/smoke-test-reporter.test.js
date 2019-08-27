const SmokeTestReporter = require('../smoke-test-reporter')

describe('SmokeTestReporter', () => {
  const reporter = new SmokeTestReporter()

  beforeAll(() => {
    reporter.writeToFile = jest.fn()
  })

  beforeEach(() => {
    jest.resetModules()
  })

  describe('onRunComplete', () => {
    it('should write test output to a file', async () => {
      const runResults = {
        testResults: [
          {
            testResults: [
              {
                status: 'skipped'
              },
              {
                status: 'passed'
              }
            ]
          }
        ]
      }

      await reporter.onRunComplete(null, runResults, null)

      expect(reporter.writeToFile).toHaveBeenCalledWith(
        'test-result.json',
        JSON.stringify({ status: 'success' })
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

      expect(reporter.writeToFile).toHaveBeenCalledWith(
        'test-result.json',
        JSON.stringify({
          status: 'failure',
          error: "Test 'smoke tests' failed with: first test, second test"
        })
      )
    })
  })
})
