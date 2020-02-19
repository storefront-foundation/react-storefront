import withAmpFormParser from 'react-storefront/middlewares/withAmpFormParser'
import { IncomingForm } from 'formidable'

describe('withAmpFormParser', () => {
  let cbMock

  beforeEach(() => {
    jest.spyOn(IncomingForm.prototype, 'parse').mockImplementation((req, cb) => {
      cbMock = cb

      return cb
    })
  })

  afterEach(() => {
    jest.restoreAllMocks()
    cbMock = undefined
  })

  it('should return status 500 when formidable produces error', () => {
    const reqMock = { method: 'POST' }
    const resMock = { status: jest.fn(() => ({ end: jest.fn() })) }
    const apiMock = jest.fn()

    withAmpFormParser(apiMock)(reqMock, resMock)

    cbMock('error', null, null)
    expect(resMock.status).toHaveBeenCalledWith(500)
    expect(apiMock).not.toBeCalled()
  })

  it('should parse the body and pass it to handler', () => {
    const reqMock = { method: 'POST' }
    const resMock = { status: jest.fn(() => ({ end: jest.fn() })) }
    const apiMock = jest.fn()

    withAmpFormParser(apiMock)(reqMock, resMock)

    cbMock(undefined, 'test', null)
    expect(apiMock).toHaveBeenCalledWith({ ...reqMock, body: 'test' }, resMock)
  })

  it('should just call handler if not a post', () => {
    const reqMock = { method: 'GET' }
    const resMock = { status: jest.fn(() => ({ end: jest.fn() })) }
    const apiMock = jest.fn()

    withAmpFormParser(apiMock)(reqMock, resMock)

    expect(apiMock).toBeCalled()
    expect(cbMock).toBe(undefined)
  })
})
