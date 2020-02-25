import fulfillAPIRequest from 'react-storefront/props/fulfillAPIRequest'

describe('fulfillAPIRequest', () => {
  it('should fetch appData if includeAppData is present', async () => {
    const req = { query: { _includeAppData: '1' } }

    const result = await fulfillAPIRequest(req, {
      appData: () => Promise.resolve(true),
      pageData: () => Promise.resolve(true),
    })

    expect(result.appData).toBe(true)
  })

  it('should fetch pageData always', async () => {
    const req = { query: {} }

    const result = await fulfillAPIRequest(req, {
      appData: () => Promise.resolve(true),
      pageData: () => Promise.resolve(true),
    })

    expect(result.appData).toBe(undefined)
    expect(result.pageData).toBe(true)
  })
})
