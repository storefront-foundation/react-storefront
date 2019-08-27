/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import fetch, { fetchWithCookies, acceptInvalidCerts } from '../src/fetch'
import pako from 'pako'
import https from 'https'
import http from 'http'
import nock from 'nock'

jest.unmock('../src/fetch')

global.http = http
global.https = https

describe('fetch', () => {
  beforeEach(() => {
    global.https = https
    global.fns = {
      export: (key, value) => {
        global.env[key] = value
      }
    }
    global.env = {}
  })

  afterEach(() => nock.cleanAll())

  it('should respond with simple text', async () => {
    nock('https://www.google.com')
      .get('/')
      .reply(200, '<!doctype html>', { 'content-type': 'html/text' })

    const html = await fetch('https://www.google.com').then(res => res.text())
    expect(html).toContain('<!doctype html>')
  })

  it('should respond with json', async () => {
    nock('https://api.com')
      .get('/')
      .reply(200, { title: 'test' })

    const data = await fetch('https://api.com').then(res => res.json())

    expect(data).toHaveProperty('title')
  })

  it('should respond with a buffer', async () => {
    nock('https://api.com')
      .get('/')
      .reply(200, { title: 'test' })

    const data = await fetch('https://api.com/').then(res => res.arrayBuffer())

    expect(JSON.parse(data.toString('utf8'))).toHaveProperty('title')
  })

  it('should POST string data verbatim', async () => {
    const body = JSON.stringify({
      title: 'foo',
      body: 'bar',
      userId: 1
    })

    nock('https://api.com')
      .post('/posts', body)
      .reply(200, { success: true })

    const data = await fetch('https://api.com/posts', {
      body,
      headers: {
        'content-type': 'application/json'
      }
    }).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should stringify and then POST non-stringified JSON', async () => {
    const body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    }

    nock('https://api.com')
      .post('/posts', JSON.stringify(body))
      .reply(200, { success: true })

    const data = await fetch('https://api.com/posts', { body }).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should send custom headers', async () => {
    nock('https://api.com', { reqheaders: { Testheader: 'Sent' } })
      .get('/anything')
      .reply(200, { success: true })

    const data = await fetch('https://api.com/anything', {
      headers: {
        Testheader: 'Sent'
      }
    }).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should send x-www-form-urlencoded data', async () => {
    nock('https://api.com', {
      reqheaders: { 'content-type': 'application/x-www-form-urlencoded', 'content-length': 7 }
    })
      .post('/anything', 'a=1&b=2')
      .reply(200, { success: true })

    const data = await fetch('https://api.com/anything', {
      body: { a: 1, b: 2 },
      headers: {
        'content-type': 'application/x-www-form-urlencoded'
      }
    }).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should send x-www-form-urlencoded data with custom qs settings', async () => {
    nock('https://api.com', {
      reqheaders: { 'content-type': 'application/x-www-form-urlencoded', 'content-length': 11 }
    })
      .post('/anything', 'a[]=1&a[]=2')
      .reply(200, { success: true })

    const data = await fetch(
      'https://api.com/anything',
      {
        body: { a: [1, 2] },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
      },
      { arrayFormat: 'brackets', encode: false }
    ).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should recalculate Content-Length for a non stringified body', async () => {
    const body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    }

    const contentLength = Buffer.byteLength(JSON.stringify(body))

    nock('https://api.com', {
      reqheaders: { 'content-type': 'application/json', 'content-length': contentLength }
    })
      .post('/anything', JSON.stringify(body))
      .reply(200, { success: true })

    const data = await fetch('https://api.com/anything', { body }).then(res => res.json())

    expect(data).toEqual({ success: true })
  })

  it('should reject responses with errors', async () => {
    nock('https://api.com')
      .get('/error')
      .reply(404)

    let error

    try {
      await fetch('https://api.com/error')
    } catch (e) {
      error = e
    }

    expect(error.message).toEqual('404: ')
  })

  it('should reject if the request throws an error', async () => {
    let rejected = false

    nock('https://api.com')
      .get('/error')
      .reply(404)

    await fetch('https://api.com/error').catch(() => (rejected = true))

    expect(rejected).toBe(true)
  })

  it('should capture set-cookie headers', async () => {
    nock('https://api.com')
      .get('/cookie')
      .reply(200, { success: true }, { 'set-cookie': 'foo=bar' })

    await fetch('https://api.com/cookie')

    expect(global.env.MUR_SET_COOKIES['api.com'].length).toEqual(1)
  })

  it('should decode gzip text responses', async () => {
    nock('https://www.example.com')
      .get('/test')
      .reply(200, pako.deflate('test'), {
        'content-encoding': 'gzip'
      })

    const result = await fetch('https://www.example.com/test').then(res => res.text())
    expect(result).toEqual('test')
  })

  it('should decode gzip json responses', async () => {
    nock('https://www.example.com')
      .get('/test')
      .reply(200, pako.deflate(JSON.stringify({ foo: 'bar' })), {
        'content-encoding': 'gzip',
        'content-type': 'application/json'
      })

    const result = await fetch('https://www.example.com/test').then(res => res.json())
    expect(result).toEqual({ foo: 'bar' })
  })

  it('should handle errors', async () => {
    nock('https://www.example.com')
      .get('/error')
      .replyWithError({ code: 'ETIMEDOUT' })

    let error = null

    try {
      await fetch('https://www.example.com/error')
    } catch (e) {
      error = e
    }

    expect(error).not.toBeNull()
  })
})

describe('fetchWithCookies', () => {
  beforeEach(() => {
    env.cookie = 'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2'
  })

  afterEach(() => {
    delete env.cookie
    delete env.shouldSendCookies
    nock.cleanAll()
  })

  it('should add env.cookie as headers.cookie', async () => {
    nock('https://api.com', { reqheaders: { cookie: env.cookie } })
      .get('/posts/1')
      .reply(200, { cookies: true })

    const result = await fetchWithCookies('https://api.com/posts/1').then(res => res.json())
    expect(result).toEqual({ cookies: true })
  })

  it('should not add cookies if "shouldSendCookies" is false', async () => {
    nock('https://api.com', { reqheaders: {} })
      .get('/posts/1')
      .reply(200, { cookies: false })

    env.shouldSendCookies = false
    const result = await fetchWithCookies('https://api.com/posts/1').then(res => res.json())
    expect(result).toEqual({ cookies: false })
  })

  it('should not add a cookie if env.cookie is undefined', async () => {
    nock('https://api.com', { reqheaders: {} })
      .get('/posts/1')
      .reply(200, { cookies: false })

    delete env.cookie
    const result = await fetchWithCookies('https://api.com/posts/1').then(res => res.json())
    expect(result).toEqual({ cookies: false })
  })

  it('should add headers.cookie to any existing headers', async () => {
    nock('https://api.com', { reqheaders: { cookie: env.cookie, 'x-api-key': 'foobar' } })
      .get('/posts/1')
      .reply(200, { cookies: true })

    const result = await fetchWithCookies('https://api.com/posts/1', {
      headers: {
        'x-api-key': 'foobar'
      }
    }).then(res => res.json())

    expect(result).toEqual({ cookies: true })
  })

  it('should respond like fetch', async () => {
    const body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    }

    nock('https://api.com', {
      reqheaders: { cookie: env.cookie, 'content-type': 'application/json', 'content-length': 39 }
    })
      .post('/posts/1', JSON.stringify(body))
      .reply(200, { success: true })

    const result = await fetchWithCookies('https://api.com/posts/1', { body }).then(res =>
      res.json()
    )

    expect(result).toEqual({ success: true })
  })
})

describe('redirect', () => {
  beforeEach(() => {
    const scope = nock('https://www.example.com')

    for (let i = 1; i <= 30; i++) {
      scope
        .get(`/redirect${i}`)
        .reply(302, undefined, { Location: `https://www.example.com/redirect${i - 1}` })
    }

    scope.get(`/redirect0`).reply(200, { success: true })

    nock('https://target.redirect.com')
      .get('/')
      .reply(302, undefined, { Location: 'https://source.redirect.com/' })

    nock('https://source.redirect.com')
      .get('/')
      .reply(200, { success: true })
  })

  describe('follow', () => {
    it('should follow up to 20 redirects by default', async () => {
      const response = await fetch('https://www.example.com/redirect20', { redirect: 'follow' })
      expect(response.redirected).toBe(true)
      expect(response.url).toBe('https://www.example.com/redirect0')
      const result = await response.json()
      expect(result).toEqual({ success: true })
    })

    it('should throw an error for more than 20 redirects by default', async () => {
      let error

      try {
        await fetch('https://www.example.com/redirect21', { redirect: 'follow' }).then(res =>
          res.json()
        )
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'The maximum number of redirects has been reached while using fetch.'
      )
    })

    it('should follow to other domains', async () => {
      const result = await fetch('https://target.redirect.com/', { redirect: 'follow' }).then(res =>
        res.json()
      )
      expect(result).toEqual({ success: true })
    })
  })

  describe('error', () => {
    it('should throw an error when a redirect is received', async () => {
      let error

      try {
        await fetch('https://www.example.com/redirect1', { redirect: 'error' }).then(res =>
          res.json()
        )
      } catch (e) {
        error = e
      }

      expect(error.message).toEqual(
        'fetch received a redirect response status 302 and options.redirect was set to "error".'
      )
    })
  })

  describe('manual', () => {
    it('should return a redirect object', async () => {
      const res = await fetch('https://www.example.com/redirect1', { redirect: 'manual' })
      expect(res.redirected).toBe(true)
      expect(res.url).toBe('https://www.example.com/redirect0')
      const result = await res.json()
      expect(result).toEqual({ redirect: 'https://www.example.com/redirect0' })
    })
    it('should return a redirect object, stringified', async () => {
      const result = await fetch('https://www.example.com/redirect1', { redirect: 'manual' }).then(
        res => res.text()
      )
      expect(result).toEqual(JSON.stringify({ redirect: 'https://www.example.com/redirect0' }))
    })
  })

  describe('user-agent', () => {
    let request

    beforeEach(() => {
      global.https = require('https')
      request = jest.spyOn(global.https, 'request')
      global.env.rsf_request = {
        headers: {
          get(name) {
            if (name.toLowerCase() === 'user-agent') {
              return 'test-user-agent'
            }
          }
        }
      }
      nock('https://www.foo.com')
        .get('/')
        .reply(200, '<!doctype html>', { 'content-type': 'html/text' })
    })

    afterEach(() => {
      delete global.https
      delete global.env.rsf_request
      jest.clearAllMocks()
    })

    it('should automatically be set to the user-agent passed in from the browser', async () => {
      await fetch('https://www.foo.com')
      expect(request.mock.calls[0][0].headers['user-agent']).toEqual('test-user-agent')
    })

    it('should retain the user-agent if explicitly set', async () => {
      await fetch('https://www.foo.com', {
        headers: {
          'user-agent': 'original'
        }
      })
      expect(request.mock.calls[0][0].headers['user-agent']).toEqual('original')
    })
  })
})
