import fromOrigin from '../../src/router/fromOrigin'
import Route from 'route-parser'

describe('fromOrigin', () => {
  it('fn should raise an error', async () => {
    const test = () => fromOrigin('desktop').fn()
    await expect(test()).rejects.toThrowError()
  })

  it('should return an OEM route config', () => {
    expect(fromOrigin('desktop').config()).toEqual({ proxy: { backend: 'desktop' } })
  })

  it('should support transformPath', () => {
    const transformed = fromOrigin('desktop').transformPath('/bar/{param}')
    const config = transformed.config(new Route('/foo/:param'))
    expect(config.proxy.rewrite_path_regex).toBe('/bar/\\1')
  })
})
