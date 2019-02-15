/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import nock from 'nock'
import fetch, { fetchWithCookies, acceptInvalidCerts } from '../src/fetch'
import pako from 'pako'
import https from 'https'

jest.unmock('../src/fetch')

describe('fetch', () => {

  beforeEach(() => {
    global.https = https;
    global.fns = {
      export: (key, value) => {
        global.env[key] = value
      }
    };
    global.env = {}
  })

  it('should respond with simple text', async () => {
    const html = await fetch('https://www.google.com').then(res => res.text());
    expect(html).toContain('<!doctype html>');
  })

  it('should respond with json', async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts/1')
		  .then(res => res.json());
    expect(data).toHaveProperty('title');
  })

  it('should respond with a buffer', async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts/1')
		  .then(res => res.arrayBuffer());
    expect(JSON.parse(data.toString('utf8'))).toHaveProperty('title');
  })

  it('should POST string data verbatim', async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts', {
		    body: JSON.stringify({
		      title: 'foo',
		      body: 'bar',
		      userId: 1
        }),
        headers: {
          "content-type": "application/json"
        }
		  })
      .then(res => res.json());
      
    expect(data).toHaveProperty('title');
  })

  it('should stringify and then POST non-stringified JSON', async () => {
    const data = await fetch('https://eu.httpbin.org/anything', {
		    body: {
		      title: 'foo',
		      body: 'bar',
		      userId: 1
        },
		  })
      .then(res => res.json());
    expect(JSON.parse(data.data)).toHaveProperty('title');
  })

  it('should send custom headers', async () => {
    const data = await fetch('https://eu.httpbin.org/anything', {
		    body: {
		      title: 'foo',
		      body: 'bar',
		      userId: 1
        },
        headers: {
          'Testheader': 'Sent'
        }
		  })
      .then(res => res.json());

    expect(data.headers).toHaveProperty('Testheader');
  })

  it('should send x-www-form-urlencoded data', async () => {
    const data = await fetch('https://eu.httpbin.org/anything', {
		    body: {
		      title: 'foo',
		      body: 'bar',
		      userId: 1
        },
        headers: {
          'content-type': 'application/x-www-form-urlencoded'
        }
		  })
      .then(res => res.json());

    expect(data.form).toHaveProperty('title');
  })

  it('should recalculate Content-Length for a non stringified body', async () => {
    const body = {
      title: 'foo',
      body: 'bar',
      userId: 1
    };

    const contentLength = Buffer.byteLength(JSON.stringify(body));
    const data = await fetch('https://eu.httpbin.org/anything', {
		    body,
		  })
      .then(res => res.json());

    expect(data.headers['Content-Length']).toEqual(contentLength.toString());
  })

  it('should reject responses with errors', async () => {
    const data = await fetch('https://jsonplaceholder.typicode.com/posts/1', {
		    body: JSON.stringify({
		      title: 'foo',
		      body: 'bar',
		      userId: 1
		    })
		  })
		  .catch(err => err.message)
    expect(data).toEqual('404: {}');
  })

  it('should reject if the request throws an error', async () => {
    let rejected = false
    
    await fetch('https://undefined')
      .catch(() => rejected = true)  

    expect(rejected).toBe(true)
  })

  it('should capture set-cookie headers', async () => {
    await fetch('https://jsonplaceholder.typicode.com/posts/1')
      .catch(err => err.message)
      
    expect(env.MUR_SET_COOKIES["jsonplaceholder.typicode.com"].length).toEqual(1);
  })

  it('should decode gzip responses', async () => {
    nock('https://www.example.com')
      .get('/test')
      .reply(200, pako.deflate('test'), {
        'content-encoding': 'gzip'
      })

    const result = await fetch('https://www.example.com/test').then(res => res.text())
    expect(result).toEqual('test')
  })
})

describe('fetchWithCookies', () => {
  let options

  beforeEach(() => {
    options = null
    env.cookie = 'JSESSIONID=EB9FC0F82486EF5F36C7851A56BB3CB2'

    global.https = global.http = {
      request: (opts, cb) => {
        options = opts
        return require('http').request(opts, cb)
      }
    }
  })

  afterEach(() => {
    delete env.cookie
    delete env.shouldSendCookies
  })

  it('should add env.cookie as headers.cookie', async () => {
    await fetchWithCookies('https://jsonplaceholder.typicode.com/posts/1')

    expect(options.headers).toEqual({ 
      cookie: env.cookie
    })

    expect(options.credentials).toBe('include')
  })

  it('should not add cookies if "shouldSendCookies" is false', async () => {
    env.shouldSendCookies = false
    await fetchWithCookies('https://jsonplaceholder.typicode.com/posts/1')
    expect(options.headers).toEqual({ })
  })

  it('should not add a cookie if env.cookie is undefined', async () => {
    delete env.cookie
    await fetchWithCookies('https://jsonplaceholder.typicode.com/posts/1')
    expect(options.headers).toEqual({ })
  })

  it('should add headers.cookie to any existing headers', async () => {
    await fetchWithCookies('https://jsonplaceholder.typicode.com/posts/1', {
      headers: {
        "x-api-key": "foobar"
      }
    })

    expect(options.headers).toEqual({ 
      "cookie": env.cookie,
      "x-api-key": "foobar"
    })
  })

  it('should respond like fetch', async () => {
    const data = await fetchWithCookies('https://eu.httpbin.org/anything', {
      body: {
        title: 'foo',
        body: 'bar',
        userId: 1
      },
    })
    .then(res => res.json())

    expect(JSON.parse(data.data)).toHaveProperty('title');
  })
})

describe('acceptInvalidCerts', () => {
  beforeEach(() => {
    global.https = require('https')
  })

  afterEach(() => {
    delete global.https
  })

  it('should return an obejct with agent: https.Agent', () => {
    const headers = acceptInvalidCerts()
    expect(headers.agent).toBeInstanceOf(https.Agent)
    expect(headers.agent.options.rejectUnauthorized).toBe(false)
  })
})