/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
jest.mock('../src/router/serviceWorker')

import React from 'react'
import { mount } from 'enzyme'
import AppModelBase from '../src/model/AppModelBase'
import PWA from '../src/PWA'
import simulant from 'simulant'
import { clearTestCache } from '../src/utils/browser'
import { Router, proxyUpstream } from '../src/router'
import { createMemoryHistory } from 'history'
import * as serviceWorker from '../src/router/serviceWorker'
import TestProvider from './TestProvider'
import { inject } from 'mobx-react'

describe('PWA', () => {
  let history, app, userAgent, location

  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation()
    jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementation(() => userAgent)
    location = { hostname: 'localhost', pathname: '/', search: '' }
    app = AppModelBase.create({ location })
    history = {
      push: jest.fn(),
      listen: jest.fn(() => Function.prototype),
      location,
      replace: jest.fn()
    }
  })

  it('should render amp-install-service worker when amp==true', () => {
    const wrapper = mount(
      <TestProvider
        history={history}
        app={AppModelBase.create({
          amp: true,
          location: { hostname: 'localhost', pathname: '/', search: '' }
        })}
      >
        <PWA>
          <div>Foo</div>
        </PWA>
      </TestProvider>
    )

    expect(wrapper).toMatchSnapshot()
  })

  it('should call history.push when a link to the same domain is clicked', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo">Foo</a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo', undefined)
  })

  it('should not call history.push when the link has a target other than _self', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_blank">
            Foo
          </a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should call history.push when a descendant element of a link is clicked', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo">
            <p id="target">Foo</p>
          </a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('#target'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo', undefined)
  })

  it('should not call history.push when the link has mailto:', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="mailto:user@domain.com">Foo</a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should not call history.push when the link has tel:', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="tel:1111111111">Foo</a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should not history.push when the link has target=_self', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_self">
            Foo
          </a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo', undefined)
  })

  it('should not call history.push when a link to another domain is clicked', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
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
      </TestProvider>,
      { attachTo: document.body }
    )

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should not call history.push when a link points to a route with a proxyUpstream handler', () => {
    const router = new Router().get('/proxy', proxyUpstream('./proxyHandler'))

    const wrapper = mount(
      <TestProvider history={history} app={app} router={router}>
        <PWA>
          <a href="/proxy">proxyUpstream</a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should render children', () => {
    expect(
      mount(
        <TestProvider history={history} app={app}>
          <PWA>
            <div>foo</div>
          </PWA>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should reload the page when data-reload="on"', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="on">
            Foo
          </a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should reload the page when data-reload="true"', () => {
    const wrapper = mount(
      <TestProvider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="true">
            Foo
          </a>
        </PWA>
      </TestProvider>,
      { attachTo: document.body }
    )

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should add the moov-safari class to the body when in safari', () => {
    clearTestCache()
    document.body.classList.remove('moov-safari')
    userAgent =
      'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1'

    mount(
      <TestProvider history={history} app={app}>
        <PWA />
      </TestProvider>,
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
      <TestProvider history={history} app={app}>
        <PWA />
      </TestProvider>,
      { attachTo: document.body }
    )

    expect(document.body.classList.contains('moov-safari')).toBe(false)
  })

  it('should record app state in history.state', done => {
    mount(
      <TestProvider history={history} app={app}>
        <PWA />
      </TestProvider>
    )

    app.applyState({ title: 'updated' })

    setTimeout(() => {
      expect(history.replace).toHaveBeenCalledWith(
        location.pathname + location.search,
        app.toJSON()
      )
      done()
    }, 200) // because state recording is debounced so it's async
  })

  it('should catch errors that occur when attempting to record app state to history', done => {
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
      location: history.location,
      listen: () => Function.prototype
    }

    history.replace({ pathname: history.location.pathname, state: { page: 'Test' } })

    expect(history.location.state).toEqual({ page: 'Test' })

    mount(
      <TestProvider history={mockHistory} app={app}>
        <PWA />
      </TestProvider>
    )

    app.applyState({ title: 'updated' })

    setTimeout(() => {
      expect(history.location.state).toEqual(null)
      done()
    }, 200) // because state recording is debounced so it's async
  })

  describe('caching SSR', () => {
    it('should cache the initialRouteData as json', () => {
      window.initialRouteData = {
        page: 'Test'
      }

      mount(
        <TestProvider history={history} app={app}>
          <PWA />
        </TestProvider>
      )

      expect(serviceWorker.cache).toHaveBeenCalledWith('/.json', window.initialRouteData)
    })

    it('should cache the html', () => {
      window.initialRouteData = {
        page: 'Test'
      }

      mount(
        <TestProvider history={history} app={app}>
          <PWA />
        </TestProvider>
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
        <TestProvider history={history} app={app} router={router}>
          <PWA />
        </TestProvider>
      )

      expect(serviceWorker.cache).toHaveBeenCalledWith('/.app-shell')
    })

    it('should not cache the app shell when one is not configured in the router', () => {
      const router = new Router()

      mount(
        <TestProvider history={history} app={app} router={router}>
          <PWA />
        </TestProvider>
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
  })

  afterEach(() => jest.resetAllMocks())
  afterAll(() => jest.unmock('../src/router/serviceWorker'))
})
