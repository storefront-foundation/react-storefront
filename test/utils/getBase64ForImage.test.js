describe('getBase64ForImage', () => {
  let getBase64ForImage

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.doMock('react-storefront/fetch', () => () => {
        return Promise.resolve({
          headers: new Headers({
            'content-type': 'image/png',
          }),
          buffer: () => Promise.resolve(Buffer.from('test-image')),
        })
      })
      getBase64ForImage = require('react-storefront/utils/getBase64ForImage').default
    })
  })

  it('should return a base 64 data url', async () => {
    const url = await getBase64ForImage('https://jest.origin.moovweb.com/image.png')
    expect(url).toBe('data:image/png;base64,dGVzdC1pbWFnZQ==')
  })
})
