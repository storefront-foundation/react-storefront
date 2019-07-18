const SmokeTestReporter = require('./SmokeTestReporter')

jest.mock('./SmokeTestReporter', () => {
    return jest.fn().mockImplementation(() => {
      return {onTestResult: onTestResult};
    });
  });

describe('SmokeTestReporter', () => {
  beforeEach(() => {
    SmokeTestReporter.mockClear()
  })


  it('Navigate to landing page', async function() {
    const test = new SmokeTestReporter('asd', 'asd')

    expect(SmokeTestReporter).toHaveBeenCalledTimes(1)
  })
})
