import headers, { reset } from './headers'
import responseHeaderTransform from '../../src/platform/responseHeaderTransform'
import { FAR_FUTURE } from '../../src/platform/cache'

describe('responseHeaderTransform', () => {
  beforeAll(() => {
    global.headers = headers
  })

  beforeEach(() => {
    global.env = {
      headers: JSON.stringify({}),
      secure: 'true',
      host: 'example.com',
      path: '/foo/bar'
    }
    global.__webpack_hash__ = 'ABC123'
    reset()
  })

  it('should remove set-cookie headers when caching on the server is set to true', () => {
    headers.header('set-cookie', 'foo=bar')
    
    global.env.MOOV_PWA_RESPONSE = {
      cache: {
        serverMaxAge: 300
      },
      cookies: []
    }

    responseHeaderTransform()

    expect(headers.header('set-cookie')).not.toBeDefined()
  })

  it('should not send set-cookie headers when caching on the server is set to true', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cache: {
        serverMaxAge: 300
      },
      cookies: ['foo=bar']
    }

    responseHeaderTransform()

    expect(headers.header('set-cookie')).not.toBeDefined()
  })

  it('should send set-cookie headers based on env.MOOV_PWA_RESPONSE', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cookies: ['foo=bar']
    }

    responseHeaderTransform()

    expect(headers.header('set-cookie')).toBe('foo=bar')
  }) 

  it('should redirect to https when http is used', () => {
    global.env.secure = 'false'
    responseHeaderTransform()
    expect(headers.header('location')).toBe('https://example.com/foo/bar')
    expect(headers.statusCode).toBe(301)
  })

  it('should cache the service worker on the server', () => {
    global.env.__static_origin_path__ = true
    global.env.path = '/service-worker.js'
    responseHeaderTransform()
    expect(headers.header('cache-control')).toBe(`no-cache, s-maxage=${FAR_FUTURE}`)
  })

  it('should cache the service worker on the server', () => {
    global.env.__static_origin_path__ = true
    global.env.path = '/service-worker.js'
    responseHeaderTransform()
    expect(headers.header('cache-control')).toBe(`no-cache, s-maxage=${FAR_FUTURE}`)
  })

  it('should cache pwa static assets on the client and server', () => {
    global.env.__static_origin_path__ = true
    global.env.path = '/pwa/main.js'
    responseHeaderTransform()
    expect(headers.header('cache-control')).toBe(`maxage=${FAR_FUTURE}, s-maxage=${FAR_FUTURE}`)
  })

  it('should cache all other static assets on the server and not send a no-cache to the client', () => {
    global.env.__static_origin_path__ = true
    global.env.path = '/foo.png'
    responseHeaderTransform()
    expect(headers.header('cache-control')).toBe(`s-maxage=${FAR_FUTURE}`)
  })

  it('should set a cookie when env.SET_COOKIE is set', () => {
    global.env.SET_COOKIE = 'foo=bar'
    responseHeaderTransform()
    expect(headers.header('set-cookie')).toBe(`foo=bar`)
  })

  it('should allow the developer to set status text', () => {
    global.env.MOOV_PWA_RESPONSE = {
      statusText: 'error',
      cookies: []
    }

    responseHeaderTransform()

    expect(headers.statusText).toBe('error')
  })

  it('should send headers', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cookies: [],
      headers: { foo: 'bar' }
    }

    responseHeaderTransform()

    expect(headers.header('foo')).toBe('bar')
  })

  it('should allow the developer to send a redirect', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cookies: [],
      statusCode: 302,
      redirectTo: '/'
    }

    responseHeaderTransform()

    expect(headers.header('location')).toBe('https://example.com/')
    expect(headers.statusCode).toBe(302)
  })

  it('should remove cache-control headers when status > 400', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cookies: [],
      cache: { serverMaxAge: 300, clientMaxAge: 300 },
      statusCode: 404
    }

    responseHeaderTransform()

    expect(headers.header('cache-control')).not.toBeDefined()
  })

  it('should remove cache-control headers when redirecting with 302', () => {
    global.env.MOOV_PWA_RESPONSE = {
      cookies: [],
      cache: { serverMaxAge: 300, clientMaxAge: 300 },
      redirectTo: '/',
      statusCode: 302
    }

    responseHeaderTransform()

    expect(headers.header('cache-control')).not.toBeDefined()
  })

  it('should cache proxied images automatically', () => {
    [
      '/images/foo.jpeg',
      '/images/foo.jpg',
      '/images/foo.png',
      '/images/foo.gif',
      '/images/foo.svg',
      '/images/foo.woff2',
      '/images/foo.ttf',
      '/images/foo.otf'
    ].map(path => {
      reset()
      global.env.path = path
      responseHeaderTransform()
      expect(headers.header('cache-control')).toBe('s-maxage=86400')
    })
  })

  it('should cache proxied images based on a configurable time', () => {
    [
      '/images/foo.jpeg',
      '/images/foo.jpg',
      '/images/foo.png',
      '/images/foo.gif',
      '/images/foo.svg',
      '/images/foo.woff2',
      '/images/foo.ttf',
      '/images/foo.otf'
    ].map(path => {
      reset()
      global.env.path = path
      responseHeaderTransform({ cacheProxiedAssets: { serverMaxAge: 60 }})
      expect(headers.header('cache-control')).toBe('s-maxage=60')
    })
  })

  afterAll(() => {
    delete global.headers
    delete global.env
    delete global.__webpack_hash__
  })

})