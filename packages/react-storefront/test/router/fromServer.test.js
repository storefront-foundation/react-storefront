/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { StaleResponseError } from '../../src/fetchLatest'

describe('fromServer', () => {
  let fetch,
    fromServer,
    oldFetchLatest,
    mod = require('../../src/fetchLatest'),
    fetchResult,
    response,
    fetchURL

  beforeEach(() => {
    oldFetchLatest = mod.fetchLatest
    fetchResult = Promise.resolve({
      json: () => ({ foo: 'bar' })
    })
    mod.fetchLatest = () =>
      (fetch = url => {
        fetchURL = url
        return fetchResult
      })
    global.env = {}
    fromServer = require('../../src/router').fromServer
    response = new (require('../../../react-storefront-moov-xdn/src/Response')).default()
  })

  afterEach(() => {
    mod.fetchLatest = oldFetchLatest
  })

  it('should return the fetched response', async () => {
    expect(await fromServer('./foo/bar').fn(null, null, response)).toEqual({
      foo: 'bar',
      loading: false
    })
  })

  it('should run the specified function', async () => {
    const handler = jest.fn()
    await fromServer(handler).fn({}, { path: '/' }, response)
    expect(handler).toHaveBeenCalled()
  })

  it('should return null when a StaleResponseError is thrown', async () => {
    fetchResult = Promise.reject(new StaleResponseError())
    const result = await fromServer('./foo').fn(null, null, response)
    expect(result).toBe(null)
  })

  it('should throw an Error when no handler path is specified', () => {
    expect(() => fromServer()).toThrowError(
      'You must provide a path to a handler in fromServer().  Please check your routes.'
    )
  })

  it('should set the handler path as x-moov-surrogate-key', async () => {
    const handler = jest.fn()
    handler.path = './test'
    await fromServer(handler).fn({}, { path: '/' }, response)
    expect(response.get('x-moov-surrogate-key')).toBe('./test')
  })

  it('should set x-rsf-handler', async () => {
    const handler = jest.fn()
    handler.path = './test'
    await fromServer(handler).fn({}, { path: '/' }, response)
    expect(response.get('x-rsf-handler')).toBe('./test')
  })

  it('should set x-rsf-response-type to json', async () => {
    const handler = jest.fn()
    await fromServer(handler).fn({}, { path: '/.json' }, response)
    expect(response.get('x-rsf-response-type')).toBe('json')
  })

  it('should set x-rsf-response-type to ssr', async () => {
    const handler = jest.fn()
    await fromServer(handler).fn({}, { path: '/' }, response)
    expect(response.get('x-rsf-response-type')).toBe('ssr')
  })

  it('should call getURL when present', async () => {
    let calledWith

    const getURL = url => {
      calledWith = url
      return `/local/us${url}`
    }

    await fromServer('./foo', getURL).fn(null, null, response)

    expect(calledWith).toBe('/.json')
    expect(fetchURL).toBe('/local/us/.json')
  })

  it('should throw all other errors', async () => {
    const error = new Error()
    fetchResult = Promise.reject(error)
    let thrown

    try {
      await fromServer('./foo').fn(null, null, response)
    } catch (e) {
      thrown = e
    }

    expect(thrown).toBe(error)
  })

  describe('fetch', () => {
    const fromServerFetch = require('../../src/router/fromServer').fetch

    it('should be defined', () => {
      expect(fromServerFetch).toBeDefined()
    })

    it('should return json', async () => {
      expect(await fromServerFetch('/foo/bar.json')).toEqual({ foo: 'bar', loading: false })
    })

    it('should redirect on the client when the location header has the same hostname as the client', async () => {
      const push = jest.fn()
      window.moov = { history: { push } }
      global.jsdom.reconfigure({ url: 'http://localhost' })
      fetchResult = Promise.resolve({ redirected: true, url: 'http://localhost/foo' })
      await fromServerFetch('/foo/bar.json')
      expect(push).toHaveBeenCalledWith('/foo')
    })

    it('should redirect on the server when the location header has a different hostname as the client', async () => {
      window.location.assign = jest.fn()
      global.jsdom.reconfigure({ url: 'http://localhost' })
      fetchResult = Promise.resolve({ redirected: true, url: 'http://example.com/foo' })
      await fromServerFetch('/foo/bar.json')
      expect(window.location.assign).toHaveBeenCalledWith('http://example.com/foo')
    })

    it('should raise an error if redirected wihout a location header', async () => {
      window.location.assign = jest.fn()
      global.jsdom.reconfigure({ url: 'http://localhost' })
      fetchResult = Promise.resolve({ redirected: true })
      let error

      try {
        await fromServerFetch('/foo/bar.json')
      } catch (e) {
        error = e
      }

      expect(error.message).toBe('Received a redirect without a location header.')
    })
  })
})
