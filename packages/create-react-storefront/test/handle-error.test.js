const handleError = require('../src/lib/handle-error')

describe('handleError', () => {
  let originalConsoleLog, originalProcessExit, stdOut

  beforeEach(() => {
    stdOut = []

    originalConsoleLog = console.log
    console.log = msg => {
      stdOut.push(msg)
    }

    originalProcessExit = process.exit
    process.exit = code => {
      console.log(code)
    }
  })

  afterEach(() => {
    console.log = originalConsoleLog
    process.exit = originalProcessExit
  })

  it('logs the error stack', () => {
    handleError(
      {
        stack: 'stack'
      },
      'message'
    )

    expect(stdOut[0]).toEqual('stack')
  })

  it('logs the message', () => {
    handleError(
      {
        stack: 'stack'
      },
      'message'
    )

    expect(stdOut[1]).toEqual('message')
  })

  it('exits with code 1', () => {
    handleError(
      {
        stack: 'stack'
      },
      'message'
    )

    expect(stdOut[2]).toEqual(1)
  })
})
