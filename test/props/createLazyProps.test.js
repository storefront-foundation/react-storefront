import createLazyProps from 'react-storefront/props/createLazyProps'

describe('createLazyProps', () => {
  describe('server', () => {
    it('should just call fetchCallback ', () => {
      jest.spyOn(global, 'window', 'get').mockImplementationOnce(() => undefined)
      const mockFetchCallback = jest.fn()

      createLazyProps(mockFetchCallback)({})

      expect(mockFetchCallback).toBeCalled()
    })
  })

  describe('client', () => {
    beforeEach(() => {
      jest.spyOn(window, 'history', 'get').mockReturnValue({ state: { rsf: {} } })
    })

    it('should return pageData from history without calling fetchCallback', () => {
      const mockFetchCallback = jest.fn()
      jest
        .spyOn(window, 'history', 'get')
        .mockReturnValueOnce({ state: { rsf: { '/test': 'test' } } })

      const result = createLazyProps(mockFetchCallback)({ asPath: '/test' })

      expect(result).toStrictEqual({ pageData: 'test' })
      expect(mockFetchCallback).not.toBeCalled()
    })

    it('should return directly results if resolved in time', async () => {
      const mockFetchCallback = jest.fn().mockReturnValueOnce(Promise.resolve('testResult'))

      const result = await createLazyProps(mockFetchCallback)({})

      expect(result).toBe('testResult')
    })

    it('should return lazy promise if not resolved in time', async () => {
      const mockFetchCallback = jest.fn().mockReturnValueOnce(
        new Promise((resolve, reject) => {
          sleep(2).then(() => {
            resolve('test')
          })
        }),
      )

      const result = await createLazyProps(mockFetchCallback, { timeout: 1 })({})

      expect(result.lazy instanceof Promise).toBeTruthy()
      expect(result.lazy).resolves.toBe('test')
    })

    it('should catch promise errors', async () => {
      const mockFetchCallback = jest.fn().mockReturnValueOnce(Promise.reject(new Error('error')))

      await expect(createLazyProps(mockFetchCallback)({})).rejects.toThrow('error')
    })
  })
})
