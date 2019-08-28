const fs = require('fs')

const statusSuccess = 'success'
const statusFailure = 'failure'
const outputFile = process.env.JEST_OUTPUT_FILENAME || 'test-result.json'

// Processes jest test results and saves them to a file.
// See https://gimpneek.github.io/jest-reporter-debug/DocumentTestHooksReporter.html
class SmokeTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options
  }

  async onRunComplete(test, runResults) {
    const summary = this.getSummary(runResults)
    await fs.writeFile(outputFile, JSON.stringify(summary))
  }

  getSummary(runResults) {
    const failedTests = {}

    // Go over all failed test cases and grab their descriptions
    const testSuiteResults = runResults.testResults
    const testCaseResults = [].concat.apply([], testSuiteResults.map(test => test.testResults))
    testCaseResults.forEach(testCase => {
      if (testCase.status !== 'failed') {
        return
      }

      if (testCase.ancestorTitles[0] in failedTests) {
        failedTests[testCase.ancestorTitles[0]].push(testCase.title)
      } else {
        failedTests[testCase.ancestorTitles[0]] = [testCase.title]
      }
    })

    let result = {}
    if (this.allTestsPassed(runResults)) {
      result.status = statusSuccess
    } else {
      result.status = statusFailure
      result.error = Object.keys(failedTests)
        .map(name => `Test '${name}' failed with: ${failedTests[name].join(', ')}`)
        .join('\n')
    }

    return result
  }

  allTestsPassed(runResults) {
    const noTestsFailed = 0 === runResults.numFailedTests
    const noTestSuitesFailed = 0 === runResults.numFailedTestSuites

    return noTestsFailed && noTestSuitesFailed
  }
}

module.exports = SmokeTestReporter
