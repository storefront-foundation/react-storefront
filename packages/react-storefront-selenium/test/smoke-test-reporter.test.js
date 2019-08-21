let SmokeTestReporter, fetch

describe('SmokeTestReporter', () => {
  beforeEach(() => {
    process.env = {}

    jest.resetModules()

    jest.mock('node-fetch')

    fetch = require('node-fetch')
    SmokeTestReporter = require('../SmokeTestReporter')
  })

  describe('onTestResult', () => {
    const runWebhook = 'https://slack.com/webhooks/run'
    const runWebhookBody = '{"run": "{message}"}'
    const failWebhook = 'https://slack.com/webhooks/fail'
    const failWebhookBody = '{"fail": "{message}"}'
    const defaultParams = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: ''
    }

    it('should send a run notification on success', async () => {
      process.env.RUN_WEBHOOK = runWebhook
      process.env.RUN_WEBHOOK_BODY = runWebhookBody

      const testResult = {
        testResults: []
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch).toHaveBeenCalledWith(runWebhook, {
        ...defaultParams,
        body: runWebhookBody.replace(/\{message\}/, 'All tests passed')
      })
    })

    it('should not run notification, if no run webhook or run webhook body provided', async () => {
      process.env.RUN_WEBHOOK = runWebhook

      const testResult = {
        testResults: []
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(0)

      process.env.RUN_WEBHOOK = ''
      process.env.RUN_WEBHOOK_BODY = runWebhookBody

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(0)
    })

    it('should not fail notification, if no fail webhook or fail webhook body provided', async () => {
      process.env.FAIL_WEBHOOK = failWebhook

      const testResult = {
        testResults: []
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(0)

      process.env.FAIL_WEBHOOK = ''
      process.env.FAIL_WEBHOOK_BODY = failWebhookBody

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(0)
    })

    it('should send run and failure notifications on failure', async () => {
      process.env.RUN_WEBHOOK = runWebhook
      process.env.RUN_WEBHOOK_BODY = runWebhookBody
      process.env.FAIL_WEBHOOK = failWebhook
      process.env.FAIL_WEBHOOK_BODY = failWebhookBody

      const testResult = {
        testResults: [
          { ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' },
          { ancestorTitles: ['smoke tests'], title: 'second test', status: 'failed' }
        ]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(2)
      expect(fetch.mock.calls).toEqual([
        [
          runWebhook,
          {
            ...defaultParams,
            body: runWebhookBody.replace(/\{message\}/, 'smoke tests failed with: first test')
          }
        ],
        [
          failWebhook,
          {
            ...defaultParams,
            body: failWebhookBody.replace(/\{message\}/, 'smoke tests failed with: first test')
          }
        ]
      ])
    })

    it('should send only failure notifications on failure with only fail webhook', async () => {
      process.env.FAIL_WEBHOOK = failWebhook
      process.env.FAIL_WEBHOOK_BODY = failWebhookBody

      const testResult = {
        testResults: [{ ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' }]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(fetch).toHaveBeenCalledTimes(1)
      expect(fetch.mock.calls).toEqual([
        [
          failWebhook,
          {
            ...defaultParams,
            body: failWebhookBody.replace(/\{message\}/, 'smoke tests failed with: first test')
          }
        ]
      ])
    })
  })
})
