import batchPromises from '../../src/utils/batchPromises'

describe('batchPromises', () => {
  it('should call the fn with all supplied inputs', async () => {
    const fn = jest.fn()
    const executionTimes = []

    await batchPromises(2, [0, 1, 2, 3, 4], input => {
      return new Promise((resolve, reject) => {
        executionTimes.push(new Date().getTime())

        setTimeout(() => {
          fn(input)
          resolve()
        }, 100)
      })
    })

    expect(executionTimes[2] - executionTimes[1]).toBeGreaterThanOrEqual(99)
  })
})
