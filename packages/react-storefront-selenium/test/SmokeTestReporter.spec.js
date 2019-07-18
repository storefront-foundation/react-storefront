let SmokeTestReporter, sendCalls

describe('SmokeTestReporter', () => {
  beforeEach(() => {
    jest.resetModules()
    sendCalls = []

    class MockWebhook {
      constructor(url) {
        this.url = url
      }
      send({ text }) {
        sendCalls.push({ url: this.url, text })
      }
    }

    jest.mock('@slack/webhook', () => ({ IncomingWebhook: MockWebhook }))
    SmokeTestReporter = require('../lib/SmokeTestReporter')
  })

  describe('onTestResult', () => {
    process.env.SLACK_RUN_WEB_HOOK = 'https://slack.com/webhooks/run'

    it('should send a run notification on success', () => {
      const testResult = {
        testResults: []
      }

      new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(sendCalls).toEqual([
        {
          url: process.env.SLACK_RUN_WEB_HOOK,
          text: 'All tests passed'
        }
      ])
    })

    it('should send run and failure notifications on failure', async () => {
      process.env.SLACK_RUN_WEB_HOOK = 'https://slack.com/webhooks/run'
      process.env.SLACK_FAIL_WEB_HOOK = 'https://slack.com/webhooks/fail'

      const testResult = {
        testResults: [
          { ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' },
          { ancestorTitles: ['smoke tests'], title: 'second test', status: 'failed' }
        ]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(sendCalls).toEqual([
        {
          url: process.env.SLACK_RUN_WEB_HOOK,
          text: 'smoke tests failed with: first test'
        },
        {
          url: process.env.SLACK_FAIL_WEB_HOOK,
          text: 'smoke tests failed with: first test'
        }
      ])
    })

    it('should send only failure notifications on failure with only fail webhook', async () => {
      process.env.SLACK_FAIL_WEB_HOOK = 'https://slack.com/webhooks/fail'
      process.env.SLACK_RUN_WEB_HOOK = ''

      const testResult = {
        testResults: [{ ancestorTitles: ['smoke tests'], title: 'first test', status: 'failed' }]
      }

      await new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(sendCalls).toEqual([
        {
          url: process.env.SLACK_FAIL_WEB_HOOK,
          text: 'smoke tests failed with: first test'
        }
      ])
    })
  })
})
