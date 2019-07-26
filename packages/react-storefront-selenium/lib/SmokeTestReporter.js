const fetch = require('node-fetch')

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
    const runWebhook = process.env.RUN_WEBHOOK
    const failWebhook = process.env.FAIL_WEBHOOK

    const failBody = process.env.RUN_WEBHOOK_BODY.replace(/\{message\}/, text)
    const runBody = process.env.FAIL_WEBHOOK_BODY.replace(/\{message\}/, text)

    if (process.env.SLACK_RUN_WEB_HOOK) {
      await fetch(runWebhook, {
        method: 'post',
        body: runBody,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!isSuccess && process.env.SLACK_FAIL_WEB_HOOK) {
      await fetch(failWebhook, {
        method: 'post',
        body: failBody,
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

module.exports = SmokeTestReporter
