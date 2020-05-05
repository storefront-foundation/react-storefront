import { prefetch, prefetchJsonFor, resetPrefetches } from '../src/prefetch'

describe('prefetch', () => {
  beforeEach(() => {
    process.env.RSF_PREFETCH_QUERY_PARAM = '__prefetch__'
    document.head.innerHTML = ''
    resetPrefetches()
  })

  afterEach(() => {
    delete window.RSF_PREFETCH_QUERY_PARAM
  })

  describe('prefetch', () => {
    it('should append a single link tag per url', async () => {
      await prefetch('/foo')
      await prefetch('/foo')
      expect(
        document.head.querySelectorAll('link[href="http://localhost/foo?__prefetch__=1"]'),
      ).toHaveLength(1)
    })

    it('should not not require window.RSF_PREFETCH_QUERY_PARAM to be defined', async () => {
      delete process.env.RSF_PREFETCH_QUERY_PARAM
      await prefetch('/foo')
      expect(document.head.querySelectorAll('link[href="/foo"]')).toHaveLength(1)
    })

    it('should not not add RSF_PREFETCH_QUERY_PARAM when fetching from a 3rd party', async () => {
      await prefetch('https://www.thirdparty.com/foo')

      expect(
        document.head.querySelectorAll('link[href="https://www.thirdparty.com/foo"]'),
      ).toHaveLength(1)
    })
  })

  describe('prefetchJsonFor', () => {
    it('should append the api prefix', async () => {
      await prefetchJsonFor('/foo')

      expect(
        document.head.querySelectorAll('link[href="http://localhost/api/foo?__prefetch__=1"]'),
      ).toHaveLength(1)
    })
  })
})
