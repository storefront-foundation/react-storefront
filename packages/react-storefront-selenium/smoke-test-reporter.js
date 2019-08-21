const fetch = require('node-fetch')

class SmokeTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onTestResult(test, testResult, aggregatedResult) {
    const failedTests = {}

    console.log('got here!!!!!!!!!!!!!')

    testResult.testResults
      .filter(el => el.status === 'failed')
      .forEach(test => {
        if (test.ancestorTitles[0] in failedTests) {
          return
        }
        failedTests[test.ancestorTitles[0]] = test.title
      })

    const failedDescriptions = Object.keys(failedTests)

    if (failedDescriptions.length) {
      const output = failedDescriptions
        .map(description => `${description} failed with: ${failedTests[description]}`)
        .join('\n')

      console.log(output)
    }
  }
}

module.exports = SmokeTestReporter
