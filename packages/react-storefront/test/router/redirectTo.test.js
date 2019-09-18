import redirectTo from '../../src/router/redirectTo'
import Route from 'route-parser'

describe('redirectTo', () => {
  it('should send a redirect', async () => {
    const handler = redirectTo('/foo/{param}')
    const req = {}
    const res = { redirect: jest.fn() }
    await handler.fn({ param: 'bar' }, req, res)
    expect(res.redirect).toHaveBeenCalledWith('/foo/bar', 302)
    expect(handler.config(new Route('/:param'))).toEqual({
      redirect: {
        rewrite_path_regex: '/foo/\\1'
      }
    })
  })

  it('should accept a status code', async () => {
    const handler = redirectTo('/foo/{param}').withStatus(301)
    const req = {}
    const res = { redirect: jest.fn() }
    await handler.fn({ param: 'bar' }, req, res)
    expect(res.redirect).toHaveBeenCalledWith('/foo/bar', 301)
    expect(handler.config(new Route('/:param'))).toEqual({
      redirect: {
        rewrite_path_regex: '/foo/\\1',
        status: 301
      }
    })
  })
})
