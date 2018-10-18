/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { StaleResponseError } from '../../src/fetchLatest'
import { createMemoryHistory } from 'history'

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
    mod.fetchLatest = () => fetch = (url) => {
      fetchURL = url
      return fetchResult
    }
    fromServer = require('../../src/router').fromServer
    response = new (require('../../src/router').Response)()
  })

  afterEach(() => {
    mod.fetchLatest = oldFetchLatest
  })

  it('should return the fetched response', async () => {
    expect(await fromServer('./foo/bar').fn(null, null, response)).toEqual({ foo: 'bar', loading: false })
  })

  it('should run the specified function', () => {
    const handler = jest.fn()
    fromServer(handler).fn(null, null, response)
    expect(handler).toHaveBeenCalled()
  })

  it('should return null when a StaleResponseError is thrown', async () => {
    fetchResult = Promise.reject(new StaleResponseError())
    const result = await fromServer('./foo').fn(null, null, response)
    expect(result).toBe(null)
  })

  it('should call getURL when present', async () => {
    let calledWith

    const getURL = (url) => {
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
      expect(window.location.assign).toHaveBeenCalledWith('http://example.com/foo');
    })

  })

})