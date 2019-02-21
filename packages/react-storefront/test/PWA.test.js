/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import PWA from '../src/PWA'
import simulant from 'simulant'
import { clearTestCache } from '../src/utils/browser'
import { Router, proxyUpstream } from '../src/router';

describe('PWA', () => {
  let history, app, userAgent

  beforeEach(() => {
    jest.spyOn(global.console, 'error').mockImplementation()
    jest.spyOn(window.navigator, 'userAgent', 'get').mockImplementation(() => userAgent)
    app = AppModelBase.create({ location: { hostname: 'localhost', pathname: '/', search: '' } })
    history = { push: jest.fn(), listen: jest.fn() }
  })

  it('should render amp-install-service worker when amp==true', () => {
    const wrapper = mount(
      <Provider history={history} app={AppModelBase.create({ amp: true, location: { hostname: 'localhost', pathname: '/', search: '' } })}>
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
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when the link has a target other than _self', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_blank">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should call history.push when a descendant element of a link is clicked', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo"><p id="target">Foo</p></a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('#target'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when the link has mailto:', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="mailto:user@domain.com">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should not call history.push when the link has tel:', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="tel:1111111111">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).not.toHaveBeenCalled()
  })

  it('should not history.push when the link has target=_self', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" target="_self">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push).toHaveBeenCalledWith('/foo')
  })

  it('should not call history.push when a link to another domain is clicked', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a id="link1" href="http://www.google.com">Google 1</a>
          <a id="link2" href="https://www.google.com">Google 2</a>
          <a id="link3" href="//www.google.com">Google 3</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should not call history.push when a link points to a route with a proxyUpstream handler', () => {
    const router = new Router()
      .get('/proxy', proxyUpstream('./proxyHandler'))
      
    const wrapper = mount(
      <Provider history={history} app={app} router={router}>
        <PWA>
          <a href="/proxy">proxyUpstream</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    document.body.querySelectorAll('a').forEach(a => simulant.fire(a, 'click'))

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should render children', () => {
    expect(mount(
      <Provider history={history} app={app}>
        <PWA>
          <div>foo</div>
        </PWA>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should reload the page when data-reload="on"', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="on">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should reload the page when data-reload="true"', () => {
    const wrapper = mount(
      <Provider history={history} app={app}>
        <PWA>
          <a href="/foo" data-reload="true">Foo</a>
        </PWA>
      </Provider>
    , { attachTo: document.body })

    simulant.fire(document.body.querySelector('a'), 'click')

    expect(history.push.mock.calls.length).toEqual(0)
  })

  it('should add the moov-safari class to the body when in safari', () => {
    clearTestCache()
    document.body.classList.remove('moov-safari')
    userAgent = "Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1"

    mount(
      <Provider history={history} app={app}>
        <PWA/>
      </Provider>
    , { attachTo: document.body })

    expect(document.body.classList.contains('moov-safari')).toBe(true)
  })

  it('should not add the moov-safari class to the body when not in safari', () => {
    clearTestCache()
    document.body.classList.remove('moov-safari')
    userAgent = "Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Mobile Safari/537.36"

    mount(
      <Provider history={history} app={app}>
        <PWA/>
      </Provider>
    , { attachTo: document.body })

    expect(document.body.classList.contains('moov-safari')).toBe(false)
  })

  it('should catch errors during rendering and display the error view', () => {
    const RenderError = () => {
      throw new Error("Error during rendering")
    }

    mount(
      <Provider history={history} app={app}>
        <PWA>
          <RenderError/>
        </PWA>
      </Provider>
    )

    expect(app.error).toBe("Error during rendering")
    expect(app.stack).not.toBeNull()
    expect(app.page).toBe('Error')
  })
})