import withCaching from 'react-storefront/utils/withCaching'

describe('withCaching', () => {
  it('should set header if maxAgeSeconds is present', () => {
    const res = { setHeader: jest.fn() }

    withCaching(jest.fn(), 10)({}, res)

    expect(res.setHeader).toBeCalled()
  })

  it('should not set header if maxAgeSeconds are not present', () => {
    const res = { setHeader: jest.fn() }

    withCaching(jest.fn())({}, res)

    expect(res.setHeader).not.toBeCalled()
  })
})
