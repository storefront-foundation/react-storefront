import createCustomCacheKey from '../../src/router/createCustomCacheKey'

describe('createCustomCacheKey', () => {
  it('should support toJSON', () => {
    const key = createCustomCacheKey()
      .addHeader('user-agent')
      .addHeader('host')
      .removeQueryParameter('uid')
      .removeQueryParameter('gclid')
      .addCookie('currency')
      .addCookie('location', cookie => {
        cookie.partition('na').byPattern('us|ca')
        cookie.partition('eur').byPattern('de|fr|ee')
      })

    expect(key.toJSON()).toEqual({
      add_headers: ['user-agent', 'host'],
      remove_query_parameters: ['uid', 'gclid'],
      add_cookies: {
        currency: null,
        location: [
          { partition: 'na', partitioning_regex: 'us|ca' },
          { partition: 'eur', partitioning_regex: 'de|fr|ee' }
        ]
      }
    })
  })
})
