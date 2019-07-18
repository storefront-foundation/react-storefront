let SmokeTestReporter, sendCalls

describe('SmokeTestReporter', () => {
  beforeAll(() => {
    process.env.SLACK_RUN_WEB_HOOK = 'https://slack.com/webhooks/run'
    process.env.SLACK_FAIL_WEB_HOOK = 'https://slack.com/webhooks/fail'
  })

  beforeEach(() => {
    sendCalls = []
    jest.resetModules()

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
    it('should send a run notification on success', () => {
      const testResult = {
        testResults: []
        // TODO create test result here
      }

      new SmokeTestReporter().onTestResult(null, testResult, null)

      expect(sendCalls).toEqual([
        {
          url: process.env.SLACK_RUN_WEB_HOOK,
          text: 'All tests passed'
        }
      ])
    })

    it('should send run and failure notifications on failure', () => {})
  })
})
