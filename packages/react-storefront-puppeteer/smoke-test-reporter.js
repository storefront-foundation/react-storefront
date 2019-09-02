const fs = require('fs')

const statusPassed = 'passed'
const statusFailed = 'failed'

const markPassed = ':white_check_mark:'
const markFailed = ':x:'

const outputFile = process.env.JEST_OUTPUT_FILENAME || 'test-result.json'

// Processes jest test results and saves them to a file.
// See https://gimpneek.github.io/jest-reporter-debug/DocumentTestHooksReporter.html
class SmokeTestReporter {
  constructor(globalConfig, options) {
    this._globalConfig = globalConfig
    this._options = options

    if (!options) {
      options = {}
    }

    this.markPassed = options.markPassed || markPassed
    this.markFailed = options.markFailed || markFailed
  }

  async onRunComplete(test, runResults) {
    const summary = this.getSummary(runResults)
    await fs.writeFile(outputFile, JSON.stringify(summary))
  }

  getSummary(runResults) {
    const testResults = new Map()

    // Go over all test cases and grab their descriptions
    const testSuiteResults = runResults.testResults
    const testCaseResults = [].concat.apply([], testSuiteResults.map(test => test.testResults))
    testCaseResults.forEach(testCase => {
      const testPassed = testCase.status !== statusFailed
      testResults.set(testCase.title, testPassed)
    })

    let result = {}
    if (this.allTestsPassed(runResults)) {
      result.status = statusPassed
    } else {
      result.status = statusFailed
    }

    result.tests = ''
    testResults.forEach((isPassed, test) => {
      result.tests += `${this.getTestMark(isPassed)} ${test}\n`
    })

    return result
  }

  allTestsPassed(runResults) {
    const noTestsFailed = 0 === runResults.numFailedTests
    const noTestSuitesFailed = 0 === runResults.numFailedTestSuites

    return noTestsFailed && noTestSuitesFailed
  }

  getTestMark(isPassed) {
    return isPassed ? this.markPassed : this.markFailed
  }
}

module.exports = SmokeTestReporter
