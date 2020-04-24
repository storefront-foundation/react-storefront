import { prefetch, prefetchJsonFor } from '../src/prefetch'

describe('prefetch', () => {
  beforeEach(() => {})

  it('should append a single link tag per url', async () => {
    await prefetch('/foo')
    await prefetch('/foo')
    expect(
      document.head.querySelectorAll('link[href="http://localhost/foo?__prefetch__=1"]'),
    ).toHaveLength(1)
  })
})

describe('prefetchJsonFor', () => {
  it('should append the api prefix', async () => {
    await prefetchJsonFor('/foo')
    expect(
      document.head.querySelectorAll('link[href="http://localhost/api/v1/foo?__prefetch__=1"]'),
    ).toHaveLength(1)
  })
})
