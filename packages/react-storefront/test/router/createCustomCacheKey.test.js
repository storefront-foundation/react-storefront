import createCustomCacheKey from '../../src/router/createCustomCacheKey'

describe('createCustomCacheKey', () => {
  it('should support toJSON', () => {
    const key = createCustomCacheKey()
      .addHeader('user-agent')
      .addHeader('host')
      .excludeQueryParameters(['uid', 'gclid'])
      .addCookie('currency')
      .addCookie('location', cookie => {
        cookie.partition('na').byPattern('us|ca')
        cookie.partition('eur').byPattern('de|fr|ee')
      })

    expect(key.toJSON()).toEqual({
      add_headers: ['user-agent', 'host'],
      query_parameters_blacklist: ['uid', 'gclid'],
      add_cookies: {
        currency: null,
        location: [
          { partition: 'na', partitioning_regex: 'us|ca' },
          { partition: 'eur', partitioning_regex: 'de|fr|ee' }
        ]
      }
    })
  })

  describe('query parameters exclusion', () => {
    it('can exclude all query parameters', () => {
      const key = createCustomCacheKey()
        .excludeAllQueryParameters()

        expect(key.toJSON().query_parameters_whitelist).toEqual([])
        expect(key.toJSON()).not.toHaveProperty('query_parameters_blacklist')
    })

    it('can exclude all some query parameters', () => {
      const key = createCustomCacheKey()
        .excludeQueryParameters(['uid', 'gclid'])

      expect(key.toJSON().query_parameters_blacklist).toEqual(['uid', 'gclid'])
      expect(key.toJSON()).not.toHaveProperty('query_parameters_whitelist')
    })

    it('can exclude all query parameters with exceptions', () => {
      const key = createCustomCacheKey()
        .excludeAllQueryParametersExcept(['page_id'])

        expect(key.toJSON().query_parameters_whitelist).toEqual(['page_id'])
        expect(key.toJSON()).not.toHaveProperty('query_parameters_blacklist')
    })

    it('prevents applying excludeQueryParameters multiple times', () => {
      // As the param is an array it could be confusing: does it append or override,
      // so we just forbid mutliple calls
      expect(() => {
        createCustomCacheKey()
          .excludeQueryParameters(['uid', 'gclid'])
          .excludeQueryParameters(['another'])
      }).toThrowError('You cannot combine multiple query params exclusion in a single custom cache key definition')
    })

    it('prevents applying multiple exlusion methods', () => {
      expect(() => {
        createCustomCacheKey()
          .excludeQueryParameters(['uid', 'gclid'])
          .excludeAllQueryParametersExcept(['page_id'])
      }).toThrowError('You cannot combine multiple query params exclusion in a single custom cache key definition')

      expect(() => {
        createCustomCacheKey()
          .excludeAllQueryParametersExcept(['page_id'])
          .excludeQueryParameters(['uid', 'gclid'])
      }).toThrowError('You cannot combine multiple query params exclusion in a single custom cache key definition')
    })
  })
})
