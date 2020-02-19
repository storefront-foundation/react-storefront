import withCaching from 'react-storefront/utils/withCaching'

describe('withCaching', () => {
  it('should set header if maxAgeSeconds are present on the browser', () => {
    const res = { setHeader: jest.fn() }

    withCaching(jest.fn(), { browser: { maxAgeSeconds: 10 } })({}, res)

    expect(res.setHeader).toBeCalled()
  })

  it('should not set header if maxAgeSeconds are not present on the browser', () => {
    const res = { setHeader: jest.fn() }

    withCaching(jest.fn(), { browser: {} })({}, res)

    expect(res.setHeader).not.toBeCalled()
  })
})
