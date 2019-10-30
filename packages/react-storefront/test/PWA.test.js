/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
jest.mock('../src/router/serviceWorker')

import React from 'react'
import Helmet from 'react-helmet'
import { mount } from 'enzyme'
import { Provider, inject } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import PWA from '../src/PWA'
import simulant from 'simulant'
import { clearTestCache } from '../src/utils/browser'
import { Router, proxyUpstream } from '../src/router'
import { createMemoryHistory } from 'history'
import * as serviceWorker from '../src/router/serviceWorker'
import TestProvider from './TestProvider'
import { types } from 'mobx-state-tree'

describe('PWA', () => {
  let history, app, userAgent, location, push, listen, replace

  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation()
    jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementation(() => userAgent)
    location = { hostname: 'localhost', pathname: '/', search: '' }
    app = AppModelBase.create({ location })
    push = jest.fn()
    listen = jest.fn(() => Function.prototype)
    replace = jest.fn()
    history = {
      push,
      listen,
      location,
      replace
    }
  })

  it('should not render title when not defined', () => {
    const wrapper = mount(
      <Provider
        history={history}
        app={AppModelBase.create({
          amp: true,
          location: { hostname: 'localhost', pathname: '/', search: '' }
        })}
      >
        <PWA>
          <div>Foo</div>
        </PWA>
      </Provider>
    )

    const helmet = Helmet.peek()

    expect(helmet.title).toEqual(undefined)
  })

  it('should render title when defined', () => {
    const wrapper = mount(
      <Provider
        history={history}
        app={AppModelBase.create({
          amp: true,
          title: 'foo',
          location: { hostname: 'localhost', pathname: '/', search: '' }
        })}
      >
        <PWA>
          <div>Foo</div>
        </PWA>
      </Provider>
    )

    const helmet = Helmet.peek()

    expect(helmet.title).toEqual('foo')
  })

  it('should render amp-install-service worker when amp==true', () => {
    const wrapper = mount(
      <Provider
        history={history}
        app={AppModelBase.create({
          amp: true,
          location: { hostname: 'localhost', pathname: '/', search: '' }
        })}
      >
        <PWA>
          <div>Foo</div>
        </PWA>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should call history.push when a link to the same domain is clicked', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo">Foo</a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when the link has a target other than _self', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_blank">
            Foo
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push).not.toHaveBeenCalled()
  })

  it('should call history.push when a descendant element of a link is clicked', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo">
            <p id="target">Foo</p>
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('#target'), 'click')

    expect(push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when the link has mailto:', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="mailto:user@domain.com">Foo</a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push).not.toHaveBeenCalled()
  })

  it('should not call history.push when the link has tel:', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="tel:1111111111">Foo</a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push).not.toHaveBeenCalled()
  })

  it('should not call history.push when the link has target=_self', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_self">
            Foo
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when a link to another domain is clicked', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a id="link1" href="http://www.google.com">
            Google 1
          </a>
          <a id="link2" href="https://www.google.com">
            Google 2
          </a>
          <a id="link3" href="//www.google.com">
            Google 3
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(push.mock.calls.length).toEqual(0)
  })

  it('should not call history.push when a link points to a route with a proxyUpstream handler', () => {
    const router = new Router().get('/proxy', proxyUpstream('./proxyHandler'))

    const wrapper = mount(
      <Provider history={history} app={app} router={router}>
        <PWA>
          <a href="/proxy">proxyUpstream</a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(push.mock.calls.length).toEqual(0)
  })

  it('should render children', () => {
    expect(
      mount(
        <Provider history={history} app={app}>
          <PWA>
            <div>foo</div>
          </PWA>
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should reload the page when data-reload="on"', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="on">
            Foo
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push.mock.calls.length).toEqual(0)
  })

  it('should reload the page when data-reload="true"', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="true">
            Foo
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(push.mock.calls.length).toEqual(0)
  })

  it('should add the moov-safari class to the body when in safari', () => {
    clearTestCache()
    document.body.classList.remove('moov-safari')
    userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'

    mount(
      <Provider history={history} app={app}>
        <PWA />
      </Provider>,
      { attachTo: document.body }
    )

    expect(document.body.classList.contains('moov-safari')).toBe(true)
  })

  it('should not add the moov-safari class to the body when not in safari', () => {
    clearTestCache()
    document.body.classList.remove('moov-safari')
    userAgent =
      'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36'

    mount(
      <Provider history={history} app={app}>
        <PWA />
      </Provider>,
      { attachTo: document.body }
    )

    expect(document.body.classList.contains('moov-safari')).toBe(false)
  })

  it('should record app state in history.state', () => {
    mount(
      <Provider history={history} app={app}>
        <PWA />
      </Provider>
    )
    app.applyState({ title: 'updated' })
    history.push('/foo')
    expect(replace).toHaveBeenCalledWith(location.pathname + location.search, app.toJSON())
  })

  it('should record history state when a link is clicked', () => {
    const title = new Date().toString()
    app.applyState({ title })

    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo">
            <p id="target">Foo</p>
          </a>
        </PWA>
      </Provider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('#target'), 'click')
    expect(replace).toHaveBeenCalledWith(location.pathname + location.search, app.toJSON())
  })

  it('should catch errors that occur when attempting to record app state to history', () => {
    const history = createMemoryHistory({ initialEntries: ['/'] })

    // The reason for this test is to ensure that if a browser blocks storing of history state because
    // a value is too large, the app should catch the error clear out the history state
    const mockHistory = {
      replace(path, state) {
        if (state) {
          throw new Error('Simulating error recording state in history')
        } else {
          history.replace(path, state)
        }
      },
      push: jest.fn(),
      location: history.location,
      listen: () => Function.prototype
    }

    history.replace({ pathname: history.location.pathname, state: { page: 'Test' } })

    expect(history.location.state).toEqual({ page: 'Test' })

    mount(
      <Provider history={mockHistory} app={app}>
        <PWA />
      </Provider>
    )

    app.applyState({ title: 'updated' })

    history.push('/foo')

    expect(history.location.state).toEqual(undefined)
  })

  describe('caching SSR', () => {
    it('should cache the initialRouteData as json', () => {
      window.initialRouteData = {
        page: 'Test'
      }

      mount(
        <Provider history={history} app={app}>
          <PWA />
        </Provider>
      )

      expect(serviceWorker.cache).toHaveBeenCalledWith('/.json', window.initialRouteData)
    })

    it('should cache the html', () => {
      window.initialRouteData = {
        page: 'Test'
      }

      mount(
        <Provider history={history} app={app}>
          <PWA />
        </Provider>
      )

      expect(serviceWorker.cache).toHaveBeenCalledWith(
        '/',
        `<!DOCTYPE html>\n${document.documentElement.outerHTML}`
      )
    })
  })

  describe('caching the app shell', () => {
    it('should cache the app shell when one is configured in the router', () => {
      const router = new Router().appShell(() => ({ loading: true }))

      mount(
        <Provider history={history} app={app} router={router}>
          <PWA />
        </Provider>
      )

      expect(serviceWorker.cache).toHaveBeenCalledWith('/.app-shell')
    })

    it('should not cache the app shell when one is not configured in the router', () => {
      const router = new Router()

      mount(
        <Provider history={history} app={app} router={router}>
          <PWA />
        </Provider>
      )

      expect(serviceWorker.cache).not.toHaveBeenCalledWith('/.app-shell')
    })
  })

  describe('error handling', () => {
    let error, errorReporter

    beforeEach(() => {
      errorReporter = jest.fn()
      error = new Error()
    })

    it('should call the errorReporter when an error occurs during rendering', () => {
      let thrown = false

      const ThrowError = () => {
        if (thrown) {
          return <div />
        } else {
          thrown = true
          throw error
        }
      }

      mount(
        <TestProvider>
          <PWA errorReporter={errorReporter}>
            <ThrowError />
          </PWA>
        </TestProvider>
      )

      expect(errorReporter).toHaveBeenCalledWith({
        error,
        app: expect.anything(),
        history: expect.anything()
      })
    })

    it('should provide the errorReporter on the context', () => {
      let provided

      const Test = inject('errorReporter')(function({ errorReporter }) {
        provided = errorReporter
        return null
      })

      mount(
        <TestProvider>
          <PWA errorReporter={errorReporter}>
            <Test />
          </PWA>
        </TestProvider>
      )

      expect(provided).toBe(errorReporter)
    })

    it('should not react app.scrollResetPending', () => {
      delete app.scrollResetPending

      let read = false

      Object.defineProperty(app, 'scrollResetPending', {
        get: () => {
          read = true
          return false
        }
      })

      const Test = () => <div>Test</div>

      mount(
        <TestProvider app={app}>
          <PWA>
            <Test />
          </PWA>
        </TestProvider>
      )

      expect(read).toBe(false)
    })

    it('should read URI', () => {
      let read = false

      const AppModel = types.compose(
        AppModelBase,
        types.model('AppModel', {}).views(self => ({
          get uri() {
            read = true
            return self.pathname + self.search
          }
        }))
      )

      const app = AppModel.create({ location })

      const Test = () => <div>Test</div>

      mount(
        <TestProvider app={app}>
          <PWA>
            <Test />
          </PWA>
        </TestProvider>
      )

      expect(read).toBe(true)
    })
  })

  afterEach(() => jest.resetAllMocks())
  afterAll(() => jest.unmock('../src/router/serviceWorker'))
})
