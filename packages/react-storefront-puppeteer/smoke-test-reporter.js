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
    const result = this.getResults(runResults)
    await this.writeToFile(outputFile, JSON.stringify(result))
  }

  getResults(runResults) {
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
    if (runResults.success) {
      result.status = statusSuccess
    } else {
      result.status = statusFailure
      result.error = Object.keys(failedTests)
        .map(name => `Test '${name}' failed with: ${failedTests[name].join(', ')}`)
        .join('\n')
    }

    return result
  }

  async writeToFile(filename, data) {
    await fs.writeFile(filename, data)
  }
}

module.exports = SmokeTestReporter
