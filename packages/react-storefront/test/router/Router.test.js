/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
jest.mock('../../src/router/serviceWorker')

import { Router, fromClient, fromServer, cache, proxyUpstream } from '../../src/router'
import ClientContext from '../../src/router/ClientContext'
import * as serviceWorker from '../../src/router/serviceWorker'
import { createMemoryHistory } from 'history'

import Request from 'react-storefront-moov-xdn/src/Request'
import Response from 'react-storefront-moov-xdn/src/Response'

describe('Router:Node', function() {
  let router, runAll, response
  const handler = params => Promise.resolve(params);

  beforeEach(function() {
    window.moov = {
      timing: {}
    }
    jest.spyOn(global.console, 'error').mockImplementation()
    process.env.MOOV_RUNTIME = 'server'
    router = new Router()
    global.headers = {
      header: Function.prototype
    }
    global.env = {
      host: 'localhost',
      headers: JSON.stringify({})
    }
    runAll = function(method, path) {
      global.env.path = path
      global.env.method = method
      const promise = router.runAll(new Request(), response = new Response())

      if (promise) {
        return promise
      } else {
        throw new Error(`no route matched ${method} ${path}`)
      }
    }
  })

  afterEach(function() {
    delete process.env.MOOV_RUNTIME
    delete global.headers
  })

  describe('runAll', function() {
    it('should match based on method', async function() {
      router
        .get('/products', () => Promise.resolve({ method: 'get' }))
        .post('/products', () => Promise.resolve({ method: 'post' }))

      expect(await runAll('get', '/products')).toEqual({ method: 'get' })
      expect(await runAll('post', '/products')).toEqual({ method: 'post' })
    })

    it('should parse query params', async () => {
      router.get('/foo', params => params)
      expect(await runAll('get', '/foo?x=1&y=2')).toEqual({ x: '1', y: '2' })
    })

    it('should support splat', async function() {
      router.get('/products/:id(/*seoText)', handler)
      expect(await runAll('get', '/products/1/foo')).toEqual({ id: "1", seoText: "foo" })
      expect(await runAll('get', '/products/1')).toEqual({ id: "1", seoText: undefined })
    })

    it('should support optional paths', async function() {
      router.get('/products/:id(/foo)', handler)
      expect(await runAll('get', '/products/1/foo')).toEqual({ id: "1" })
      expect(await runAll('get', '/products/1')).toEqual({ id: "1" })
    })

    it('should support optional params', async function() {
      router.get('/products/:id(/:foo)', handler)
      expect(await runAll('get', '/products/1/2')).toEqual({ id: "1", foo: "2" })
      expect(await runAll('get', '/products/1')).toEqual({ id: "1", foo: undefined })
    })

    it('should match based on suffix', async function() {
      router.get('/users/:id.html',
        fromServer(() => Promise.resolve({ result: 'html' }))
      )
      router.get('/users/:id.json',
        fromServer(() => Promise.resolve({ result: 'json' }))
      )

      expect(await runAll('get', '/users/1.html')).toEqual({ result: 'html' })
      expect(await runAll('get', '/users/1.json')).toEqual({ result: 'json' })
    })

    it('should capture the suffix', async function() {
      router.get('/users/:id.:format', params => Promise.resolve(params))
      expect(await runAll('get', '/users/1.html')).toEqual({ id: '1', format: 'html' })
      expect(await runAll('get', '/users/1.json')).toEqual({ id: '1', format: 'json' })
    })

    it('should merge the result of multiple handlers', async function() {
      router.get('/c/:id',
        fromClient({ view: 'category' }),
        fromServer(() => Promise.resolve({ name: 'test' })),
        fromServer(() => ({ url: '/c/1' }))
      )

      expect(await runAll('get', '/c/1')).toEqual({ view: 'category', name: 'test', url: '/c/1' })
    })

    it('should apply params to request', async () => {
      let requestParams

      router.get('/c/:id',
        fromServer((params, request) => requestParams = request.params)
      )

      await runAll('get', '/c/1')
      expect(requestParams).toEqual({ id: "1" })
    })

    it('should not mutate the provided state', async () => {
      router.get('/',
        fromClient({ foo: 'xxx' })
      )

      const initialState = { foo: 'bar' }
      const request = { path: '/', search: '', method: 'get' }
      const result = await router.runAll(request, new Response(), { }, initialState)

      expect(result.foo).toEqual('xxx')
      expect(initialState.foo).toEqual('bar')
    })
  })

  describe('run', function() {

    it('should run after handlers on fallback when afterOnly is true', async () => {
      let ran = false
      const response = new Response()

      router
        .fallback({
          runOn: {
            server: true,
            client: true,
            after: true
          },
          fn: () => {
            return true
          }
        })

      for await (let result of router.run({ path: '/', search: '' }, response)) {
        ran = result
      }

      expect(ran).toBe(true)
    })

    it('should yield the accumulated state from handlers that succeeded', async function() {
      const response = new Response()

      router
        .get('/',
          fromClient({ view: 'home' }),
          fromServer(() => {
            throw new Error('test')
          })
        )
        .error((path, params, request, response) => Promise.resolve({
          error: 'Error message'
        }))

      const results = []

      for await (let result of router.run({ path: '/', search: '' }, response)) {
        results.push(result)
      }

      expect(results[0]).toEqual({ view: 'home' })
      expect(results[1]).toEqual({ error: 'Error message' })
      expect(results.length).toEqual(2)
      expect(await router.runAll({ path: '/', search: '', method: 'GET' }, response)).toEqual({ view: 'home', error: 'Error message' })
    })

    describe('initialLoad', () => {
      beforeEach(() => process.env.MOOV_RUNTIME = 'client')
      afterEach(() => delete process.env.MOOV_RUNTIME)

      it('should cache initial state when run with initialLoad: true', async () => {
        router
          .get('/',
            cache({ client: true }),
            fromClient({ view: 'home' })
          )

        window.initialState = { view: 'home', foo: 'bar' }
        await router.runAll({ path: '/', search: '', method: 'get' }, new ClientContext(), { initialLoad: true, afterOnly: true })
        expect(serviceWorker.cache.mock.calls[0]).toEqual(['/', '<!DOCTYPE html>\n<html><head></head><body></body></html>'])
      })
    })
  })

  describe('handlers', function() {

    it('should run data requests on server side', async function() {
      router.get('/products.json',
        fromServer(() => Promise.resolve({
          products: [{name: 'Dog Toy'}]
        })),
      )
      expect(await runAll('get', '/products.json')).toEqual({
        products: [{name: 'Dog Toy'}]
      })
    })

    it('should not execute fromClient on data request', async function() {
      router.get('/c/:id.json', fromClient({ view: 'category' }));
      expect((await runAll('get', '/c/1.json')).view).not.toBeDefined()
     });

    it('should accept static data', async function() {
      router.get('/c/:id',
        fromClient({ view: 'category' }),
      )

      expect(await runAll('get', '/c/1')).toEqual({ view: 'category' })
    })

    it('should accept static promises', async function() {
      router.get('/c/:id',
        fromClient(() => Promise.resolve({ view: 'category' })),
      )

      expect(await runAll('get', '/c/1')).toEqual({ view: 'category' })
    })

    it('should run synchronous functions', async function() {
      router.get('/c/:id',
        fromClient(() => ({ view: 'category' })),
      )

      expect(await runAll('get', '/c/1')).toEqual({ view: 'category' })
    })

    it('should handle errors on the client side with default error handler', async function() {
      router.get('/test/:id',
        fromClient(() => {
          throw new Error('This is an error');
        }),
      )
      const state = await runAll('get', '/test/123');
      expect(state.error).toEqual('This is an error')
      expect(state.stack).toBeDefined();
    })

    it('should handle errors on the client side with custom error handler', async function() {
      router.get('/test/:q',
        fromClient(() => {
          throw new Error('This is an error');
        }),
      ).error((e, params, request, response) => {
        return {
          q: params.q,
          message: e.message
        }
      })
      expect(await runAll('get', '/test/123')).toEqual({
        q: '123',
        message: 'This is an error'
      })
    })

    it('should handle errors on the server side with default error handler', async function() {
      router.get('/test',
        fromServer(() => {
          throw new Error('This is an error on the server');
        }),
      )
      const state = await runAll('get', '/test');
      expect(state.error).toEqual('This is an error on the server')
      expect(state.stack).toBeDefined()
      expect(state.loading).toBe(false)
      expect(state.page).toBe('Error')
    })

    it('should handle errors on the server side with custom error handler', async function() {
      router.get('/test/:q',
        fromServer(() => {
          throw new Error('This is an error on the server');
        }),
      ).error((e, params, request, response) => {
        return {
          q: params.q,
          message: e.message
        }
      })
      expect(await runAll('get', '/test/123')).toEqual({
        q: '123',
        message: 'This is an error on the server'
      })
    })

    it('should provide params in client handler', async function() {
      router.get('/c/:id',
        fromClient((params) => ({ view: 'category', id: params.id, query: params.q }))
      )
      expect(await runAll('get', '/c/1?q=hello')).toEqual({
        view: 'category',
        query: 'hello',
        id: '1'
      })
    })

    it('should handle simple 404', async function() {
      router.get('/test', fromClient(() => ({ view: 'test' })))

      expect(await runAll('get', '/hello')).toEqual({
        page: '404'
      })
    })

    it('should handle error in extended 404 properly', async function() {
      router
        .get('/test', fromClient(() => ({ view: 'test' })))
        .fallback(fromServer(() => {
          throw new Error('This is an error on the server');
        }))
      const state = await runAll('get', '/hello');
      expect(state.error).toEqual('This is an error on the server')
      expect(state.stack).toBeDefined()
    })

    it('should handle extended 404 rendering', async function() {
      router
        .get('/test', fromClient(() => ({ view: 'test' })))
        .fallback(
          fromClient({ view: '404' }),
          fromServer(() => Promise.resolve({
            products: [{ name: 'Dog Toy' }, { name: 'Bone' }]
          }))
        )
      expect(await runAll('get', '/hello')).toEqual({
        view: '404',
        products: [{ name: 'Dog Toy' }, { name: 'Bone' }]
      })
    })
  })

  describe('cache', function() {
    it('should set response.cache', async function () {
      router.get('/foo',
        fromClient({ view: 'Foo' }),
        fromServer(() => ({ foo: 'bar' })),
        cache({
          server: {
            maxAgeSeconds: 300
          }
        })
      )

      expect(await runAll('get', '/foo')).toEqual({ view: 'Foo', foo: 'bar' })
      expect(response.cache).toEqual({ browserMaxAge: 0, serverMaxAge: 300 })
    })
  })

  describe('use', function() {
    it('match a nested route', async function() {
      router.use('/products', new Router()
        .get('/:id', handler)
      )

      expect(await runAll('get', '/products/1')).toEqual({ id: '1' })
    })

    it('should accept params', async function() {
      router.use('/products/:id', new Router()
        .get('/reviews/:reviewId', handler)
      )

      expect(await runAll('get', '/products/1/reviews/2')).toEqual({ id: '1', reviewId: '2' })
    });

    it('should accept infinite levels of nesting', async function() {
      router.use('/products', new Router()
        .get('/:productId', handler)
        .use('/:productId/reviews', new Router()
          .get('/:reviewId', handler)
        )
      );

      expect(await runAll('get', '/products/1/reviews/2')).toEqual({ productId: '1', reviewId: '2' })
    })

    it('should match based on extension', async function() {
      router.use('/c', new Router()
        .get('/:id.html', () => Promise.resolve('html'))
        .get('/:id.json', () => Promise.resolve('json'))
      );

      expect(await runAll('get', '/c/1.html')).toEqual('html')
      expect(await runAll('get', '/c/1.json')).toEqual('json')
    })
  })

  describe('configureClientCache', () => {
    it('should call configureCache', () => {
      const config = {
        cacheName: 'api',
        maxEntries: 200,
        maxAgeSeconds: 3600
      }
      expect(router.configureClientCache(config)).toBe(router)
      expect(serviceWorker.configureCache).toBeCalledWith(config)
    })
  })

  describe('applySearch', () => {
    it('should preserve existing query params', () => {
      const history = createMemoryHistory()
      history.push('/search?filter=test')

      router
        .watch(history, jest.fn())
        .applySearch({ sort: 'price' })

      expect(history.location.pathname + history.location.search).toEqual('/search?filter=test&sort=price')
    })

    it('should swap the existing query param of the same name', () => {
      const history = createMemoryHistory()
      history.push('/search?filter=test&sort=price')

      router
        .watch(history, jest.fn())
        .applySearch({ sort: 'name' })

      expect(history.location.pathname + history.location.search).toEqual('/search?filter=test&sort=name')
    })
  })

  describe('getCacheKey', () => {
    it('should return the defaults when no key function is specified', () => {
      router.get('/test',
        cache({
          server: {
            maxAgeSeconds: 60
          }
        })
      )

      expect(router.getCacheKey({ path: '/test', search: '', method: 'get' }, { foo: 'bar' })).toEqual({ foo: 'bar' })
    })

    it('should return the defaults when no server config is specified', () => {
      router.get('/test',
        cache({
          client: true
        })
      )

      expect(router.getCacheKey({ path: '/test', search: '', method: 'get' }, { foo: 'bar' })).toEqual({ foo: 'bar' })
    })

    it('should return the defaults when no cache handler is specified', () => {
      router.get('/test',
        fromClient({ a: 'b' })
      )

      expect(router.getCacheKey({ path: '/test', search: '', method: 'get' }, { foo: 'bar' })).toEqual({ foo: 'bar' })
    })

    it('should call cache.server.key for the matching route', () => {
      router.get('/test',
        cache({
          server: {
            key: (request, defaults) => ({ ...defaults, path: request.path + request.search })
          }
        })
      )

      expect(router.getCacheKey({ path: '/test', search: '' }, { foo: 'bar' })).toEqual({ foo: 'bar', path: '/test' })
    })

    it('should work on fallback routes', () => {
      router
        .fallback(
          cache({
            server: {
              key: (request, defaults) => ({ ...defaults, path: request.path + request.search })
            }
          })
        )

      expect(router.getCacheKey({ path: '/test', search: '' }, { foo: 'bar' })).toEqual({ foo: 'bar', path: '/test' })
    })
  })

  describe('watch', () => {
    it('should run route when history changes', () => {
      const history = createMemoryHistory()
      history.push('/')
      const handler = jest.fn()

      router
        .watch(history, jest.fn())
        .get('/search',
          fromClient(handler)
        )

      history.push('/search')
      expect(handler).toHaveBeenCalled()
    })

    it('should not run route when previous location is the same as the new location', () => {
      const history = createMemoryHistory()
      history.push('/search')
      const handler = jest.fn()

      router
        .watch(history, jest.fn())
        .get('/search',
          fromClient(handler)
        )

      history.push('/search')
      expect(handler).not.toHaveBeenCalled()
    })

    it('should restore the previous app state on back', () => {
      const handler = jest.fn()
      const history = createMemoryHistory()
      history.push('/search', { title: 'Search' })
      history.push('/c/1', { title: 'Category #1' })
      router.watch(history, handler)
      history.goBack()

      expect(handler).toHaveBeenCalledWith(
        { title: 'Search' },
        'POP'
      )
    })

    it('should restore the previous app state on forward', () => {
      const handler = jest.fn()
      const history = createMemoryHistory()
      history.push('/search', { title: 'Search' })
      history.push('/c/1', { title: 'Category #1' })
      history.goBack()
      router.watch(history, handler)
      history.goForward()

      expect(handler).toHaveBeenCalledWith(
        { title: 'Category #1' },
        'POP'
      )
    })

    it('should capture routeStart and routeEnd timing data', async () => {
      const history = createMemoryHistory()
      router.get('/', fromClient({ view: 'home' }))
      router.watch(history, Function.prototype)
      history.push('/')
      expect(window.moov.timing.routeStart)
    })
    
    it('should yield state from clicked Link', () => {
      const handler = jest.fn()
      const history = createMemoryHistory({ initialEntries: ['/'] })

      router
        .get('/p/:id', fromClient({ foo: 'bar' }))
        .watch(history, handler)

      history.push('/p/1', { product: { name: 'Test' }})

      return new Promise((resolve) => {
        setTimeout(() => {
          expect(handler).toHaveBeenCalledWith({ product: { name: 'Test' }}, 'PUSH')
          resolve()
        })
      })
    })
  })

  describe('reloadFromServer', () => {
    it('should reset the history.location to the previous location', () => {
      const history = createMemoryHistory({ initialEntries: ['/'] })
      history.goBack = jest.fn()
      const router = new Router().watch(history)
      router.reloadFromServer()
      expect(history.goBack).toHaveBeenCalled()
    })
  })

  describe('willFetchFromUpstream', () => {
    it('should return true if the route has a proxyUpstream handler', () => {
      const router = new Router()
        .get('/about', proxyUpstream())

      expect(router.willFetchFromUpstream({ path: '/about', search: '' })).toBe(true)
    })

    it('should return false if the route has no proxyUpstream handler', () => {
      const router = new Router()
        .get('/about', proxyUpstream())

      expect(router.willFetchFromUpstream({ path: '/', search: '' })).toBe(false)
    })
  })

  describe('after', function() {
    it('should be called after all routes', async (done) => {
      const history = createMemoryHistory()

      const router = new Router()
        .get('/foo', fromClient({}))
        .watch(history, Function.prototype)

      const onAfter = jest.fn()
      const onBefore = jest.fn()

      router.on('after', onAfter)
      router.on('before', onBefore)

      history.push('/foo')
      
      setTimeout(() => {
        expect(onAfter).toHaveBeenCalled()
        expect(onBefore).toHaveBeenCalled()
        done()
      }, 500)
    })    

    it('should fire an after event with initialLoad: true', () => {
      const history = createMemoryHistory()
      const onAfter = jest.fn()
      const router = new Router().get('/foo', fromClient({}))
      router.on('after', onAfter)
      router.watch(history, Function.prototype)
      expect(onAfter).toHaveBeenCalled()
    })
  })

  describe('Fetching within cacheable route', () => {
    it('should set send cookie ENV variable for fetch', async () => {
      router.get('/new',
        cache({ 
          server: { maxAgeSeconds: 300 }
        }),
        fromServer(() => {
          return Promise.resolve('NEW PRODUCTS')
        })          
      )
      await runAll('get', '/new')
      expect(env.shouldSendCookies).toBe(false);
    })
  })

  afterAll(() => {
    jest.unmock('../../src/router/serviceWorker')
  })
})