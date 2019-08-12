let handleError

describe('handleError', () => {
  let originalConsoleLog, originalProcessExit, stdOut

  beforeEach(() => {
    stdOut = []
    originalConsoleLog = console.log
    console.log = msg => stdOut.push(msg)
    originalProcessExit = process.exit
    process.exit = jest.fn()
    process.env.NODE_ENV = 'production'
    handleError = require('../src/lib/handle-error')
  })

  afterEach(() => {
    console.log = originalConsoleLog
    process.exit = originalProcessExit
    process.env.NODE_ENV = 'test'
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

    expect(process.exit).toHaveBeenCalledWith(1)
  })
})
