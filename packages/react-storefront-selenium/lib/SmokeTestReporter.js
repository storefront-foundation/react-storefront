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

    const runBody = process.env.RUN_WEBHOOK_BODY
    const failBody = process.env.FAIL_WEBHOOK_BODY

    if (runWebhook && runBody) {
      await fetch(runWebhook, {
        method: 'POST',
        body: runBody.replace(/\{message\}/, text),
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!isSuccess && failWebhook && failBody) {
      await fetch(failWebhook, {
        method: 'POST',
        body: failBody.replace(/\{message\}/, text),
        headers: { 'Content-Type': 'application/json' }
      })
    }
  }
}

module.exports = SmokeTestReporter
