describe('installServiceWorker', () => {
  beforeEach(() => {
    window.__build_timestamp__ = new Date()
  })

  it('should not throw an error', () => {
    require('../../src/amp/installServiceWorker')
  })

  afterEach(() => {
    delete window.__build_timestamp__
  })
})
