const { IncomingWebhook } = require('@slack/webhook')

class SmokeTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onTestResult(test, testResult, aggregatedResult) {
    const failedTests = {}

    testResult.testResults
      .filter(el => el.status === 'failed')
      .forEach(test => {
        if (test.ancestorTitles[0] in failedTests) {
          return
        }

        failedTests[test.ancestorTitles[0]] = test.title
      })

    const failedDescriptions = Object.keys(failedTests)

    if (failedDescriptions.length === 0) {
      return this.sendNotifications(`All tests passed`, true)
    }

    const text = failedDescriptions
      .map(description => `${description} failed with: ${failedTests[description]}`)
      .join('\n')

    return this.sendNotifications(text, false)
  }

  async sendNotifications(text, isSuccess) {
    const runWebhook = new IncomingWebhook(process.env.SLACK_RUN_WEB_HOOK || '')
    const failWebhook = new IncomingWebhook(process.env.SLACK_FAIL_WEB_HOOK || '')

    if (isSuccess && process.env.SLACK_RUN_WEB_HOOK) {
      await runWebhook.send({ text })
    }

    if (!isSuccess && process.env.SLACK_FAIL_WEB_HOOK) {
      await failWebhook.send({ text })
    }
  }
}

module.exports = SmokeTestReporter
