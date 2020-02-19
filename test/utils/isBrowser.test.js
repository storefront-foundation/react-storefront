import isBrowser from 'react-storefront/utils/isBrowser'

describe('isBrowser', () => {
  it('should return true if window is defined', () => {
    expect(isBrowser()).toBe(true)
  })

  it('should return false if window is not defined', () => {
    jest.spyOn(global, 'window', 'get').mockImplementation(() => undefined)
    expect(isBrowser()).toBe(false)
  })
})
