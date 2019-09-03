/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import 'babel-polyfill'
import { expect } from 'chai'
import { Router, fromClient, fromServer, cache } from '../../src/router'
import sinon from 'sinon'
import { createMemoryHistory } from 'history'
import Response from '../../../react-storefront-moov-xdn/src/Response'
import qs from 'qs'

const location = {
  protocol: 'http',
  pathname: '/context.html',
  search: '',
  hostname: 'localhost',
  port: '9876'
}
const allRouteData = { loading: false, location }

describe('Router:Browser', function() {
  let router, runAll
  const handler = fromClient(params => Promise.resolve(params))
  const response = new Response()

  beforeEach(function() {
    router = new Router()

    Object.assign(window, {
      moov: {
        state: {
          toJSON: () => ({})
        },
        timing: {}
      },
      process: {
        env: {
          MOOV_RUNTIME: 'client'
        }
      }
    })

    runAll = function(method, uri) {
      const [path, search] = uri.split(/\?/)
      const query = qs.parse(search)
      const request = { path, query, method }
      const promise = router.runAll(request, response)

      if (promise) {
        return promise
      } else {
        throw new Error(`no route matched ${method} ${path}`)
      }
    }
  })

  describe('runAll', function() {
    it('should match based on method', async function() {
      router
        .get('/products', fromClient(() => Promise.resolve({ method: 'get' })))
        .post('/products', fromClient(() => Promise.resolve({ method: 'post' })))

      expect(await runAll('get', '/products')).to.deep.equal({ method: 'get', ...allRouteData })
      expect(await runAll('post', '/products')).to.deep.equal({ method: 'post', ...allRouteData })
    })

    it('should support splat', async function() {
      router.get('/products/:id(/*seoText)', handler)
      expect(await runAll('get', '/products/1/foo')).to.deep.equal({
        id: '1',
        seoText: 'foo',
        ...allRouteData
      })
      expect(await runAll('get', '/products/1')).to.deep.equal({
        id: '1',
        seoText: undefined,
        ...allRouteData
      })
    })

    it('should support optional paths', async function() {
      router.get('/products/:id(/foo)', handler)
      expect(await runAll('get', '/products/1/foo')).to.deep.equal({ id: '1', ...allRouteData })
      expect(await runAll('get', '/products/1')).to.deep.equal({ id: '1', ...allRouteData })
    })

    it('should support optional params', async function() {
      router.get('/products/:id(/:foo)', handler)
      expect(await runAll('get', '/products/1/2')).to.deep.equal({
        id: '1',
        foo: '2',
        ...allRouteData
      })
      expect(await runAll('get', '/products/1')).to.deep.equal({
        id: '1',
        foo: undefined,
        ...allRouteData
      })
    })

    it('should match based on suffix', async function() {
      router.get('/users/:id.html', fromClient(() => Promise.resolve('html')))
      expect(await runAll('get', '/users/1.html')).to.equal('html')
    })

    it('should capture the suffix', async function() {
      router.get('/users/:id.:format', fromClient(params => Promise.resolve(params)))
      expect(await runAll('get', '/users/1.html')).to.deep.equal({
        id: '1',
        format: 'html',
        ...allRouteData
      })
    })

    it('should merge the result of multiple handlers', async function() {
      router.get(
        '/c/:id',
        fromClient({ view: 'category' }),
        fromServer(() => Promise.resolve({ name: 'test', loading: false })),
        fromServer(() => ({ url: '/c/1', loading: false }))
      )

      const result = await runAll('get', '/c/1')
      const expected = { ...allRouteData, view: 'category', name: 'test', url: '/c/1' }

      expect(result).to.deep.equal(expected)
    })

    it('should set loading: false during initialLoad', async () => {
      router.get('/', fromServer((params, request, response) => ({ foo: 'bar' })))

      const initialState = { loading: false }
      const request = { path: '/', method: 'get' }
      await router.runAll(request, { initialLoad: true }, response, initialState)
      expect(initialState.loading).to.equal(false)
    })
  })

  describe('handlers', function() {
    it('should not run data requests on client side', async function() {
      router.get(
        '/products.json',
        fromServer(() =>
          Promise.resolve({
            products: [{ name: 'Dog Toy' }],
            loading: false
          })
        )
      )
      expect(await runAll('get', '/products.json')).to.not.deep.equal({
        products: [{ name: 'Dog Toy' }],
        ...allRouteData
      })
    })

    it('should static data', async function() {
      router.get('/c/:id', fromClient({ view: 'category' }))

      expect(await runAll('get', '/c/1')).to.deep.equal({ view: 'category', ...allRouteData })
    })

    it('should static promises', async function() {
      router.get('/c/:id', fromClient(() => Promise.resolve({ view: 'category' })))

      expect(await runAll('get', '/c/1')).to.deep.equal({ view: 'category', ...allRouteData })
    })

    it('should synchronous functions', async function() {
      router.get('/c/:id', fromClient(() => ({ view: 'category' })))

      expect(await runAll('get', '/c/1')).to.deep.equal({ view: 'category', ...allRouteData })
    })

    it('should handle errors on the client side with default error handler', async function() {
      router.get(
        '/test/:id',
        fromClient(() => {
          throw new Error('This is an error')
        })
      )
      const state = await runAll('get', '/test/123')
      expect(state).to.have.property('error', 'This is an error')
      expect(state).to.have.property('stack')
    })

    it('should handle errors on the client side with custom error handler', async function() {
      router
        .get(
          '/test/:q',
          fromClient(() => {
            throw new Error('This is an error')
          })
        )
        .error((e, params, state) => {
          return {
            q: params.q,
            message: e.message
          }
        })
      expect(await runAll('get', '/test/123')).to.deep.equal({
        q: '123',
        message: 'This is an error',
        ...allRouteData
      })
    })

    it('should handle errors on the server side with default error handler', async function() {
      router.get(
        '/test',
        fromServer(() => {
          throw new Error('This is an error on the server')
        })
      )
      const state = await runAll('get', '/test')
      expect(state).to.have.property('error', 'This is an error on the server')
      expect(state).to.have.property('stack')
    })

    it('should handle errors on the server side with custom error handler', async function() {
      router
        .get(
          '/test/:q',
          fromServer(() => {
            throw new Error('This is an error on the server')
          })
        )
        .error((e, params, state) => {
          return {
            q: params.q,
            message: e.message,
            loading: false
          }
        })
      expect(await runAll('get', '/test/123')).to.deep.equal({
        ...allRouteData,
        q: '123',
        message: 'This is an error on the server'
      })
    })

    it('should provide params in client handler', async function() {
      router.get(
        '/c/:id',
        fromClient(params => ({ view: 'category', id: params.id, query: params.q }))
      )

      expect(await runAll('get', '/c/1?q=hello')).to.deep.equal({
        view: 'category',
        query: 'hello',
        id: '1',
        ...allRouteData
      })
    })
  })

  describe('use', function() {
    it('match a nested route', async function() {
      router.use('/products', new Router().get('/:id', handler))

      expect(await runAll('get', '/products/1')).to.deep.equal({ id: '1', ...allRouteData })
    })

    it('should accept params', async function() {
      router.use('/products/:id', new Router().get('/reviews/:reviewId', handler))

      expect(await runAll('get', '/products/1/reviews/2')).to.deep.equal({
        id: '1',
        reviewId: '2',
        ...allRouteData
      })
    })

    it('should accept infinite levels of nesting', async function() {
      router.use(
        '/products',
        new Router()
          .get('/:productId', handler)
          .use('/:productId/reviews', new Router().get('/:reviewId', handler))
      )

      expect(await runAll('get', '/products/1/reviews/2')).to.deep.equal({
        productId: '1',
        reviewId: '2',
        ...allRouteData
      })
    })

    it('should match based on extension', async function() {
      router.use('/c', new Router().get('/:id.html', fromClient(() => Promise.resolve('html'))))

      expect(await runAll('get', '/c/1.html')).to.equal('html')
    })
  })

  describe('watch', function() {
    it('should not be called callback when only hash has changed', async function() {
      const watchCallback = sinon.spy()

      router.get(
        '/test',
        fromClient({ view: 'test' }),
        fromServer(() => Promise.resolve({ value: 'test' }))
      )

      const history = createMemoryHistory()
      expect(history.location.pathname).to.equal('/')
      expect(history.location.hash).to.equal('')

      router.watch(history, watchCallback)

      history.push('/test')
      expect(history.location.pathname).to.equal('/test')
      expect(history.location.hash).to.equal('')

      // after handlers should be fired asynchronously so we don't hold up the app initialization
      // so we need to wait a little to see if they fired
      const callCount = await new Promise((resolve, reject) => {
        setTimeout(() => {
          resolve(watchCallback.callCount)
        }, 100)
      })

      history.push('/test#test')
      expect(history.location.pathname).to.equal('/test')
      expect(history.location.hash).to.equal('#test')
      expect(watchCallback.callCount).to.equal(callCount)
    })

    it('should yield state from clicked Link', done => {
      let calls = []
      const history = createMemoryHistory({ initialEntries: ['/'] })

      router
        .get('/p/:id', fromClient({ foo: 'bar' }))
        .watch(history, (state, method) => calls.push({ state, method }))

      history.push('/p/1', { product: { name: 'Test' } })

      setTimeout(() => {
        expect(calls[0]).to.deep.equal({
          state: {
            product: { name: 'Test' }
          },
          method: 'PUSH'
        })
        done()
      }, 100)
    })
  })

  describe('cache', function() {
    it('should be called on the client', async function() {
      const cacheHandler = cache({ edge: { maxAgeSeconds: 300 } })
      cacheHandler.fn = sinon.fake()

      router.get(
        '/test',
        cacheHandler,
        fromClient({ view: 'test' }),
        fromServer(() => Promise.resolve({ value: 'test' }))
      )

      await router.runAll({ path: '/test', search: '' }, response)
      expect(cacheHandler.fn.called).to.be.true
    })
  })

  describe('fetch', async () => {
    it('should be fired when a fromServer handler runs', async function() {
      const router = new Router().get('/', {
        type: 'fromServer',
        runOn: { client: true, server: true },
        fn: () => Promise.resolve({})
      })

      const fn = sinon.fake()
      router.on('fetch', fn)
      await router.runAll({ path: '/' }, response)
      expect(fn.called).to.be.true
    })
  })
})
