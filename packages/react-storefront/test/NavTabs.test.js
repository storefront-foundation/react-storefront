/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import NavTabs from '../src/NavTabs'
import AppModelBase from '../src/model/AppModelBase'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import { configureAnalytics } from '../src/analytics'
import waitForAnalytics from './helpers/waitForAnalytics'

describe('NavTabs', () => {

  let app, history, location

  beforeEach(() => {
    location = {
      procotol: 'https',
      hostname: 'example.com',
      pathname: '/',
      search: ''
    }

    app = AppModelBase.create({
      location,
      tabs: {
        items: [
          { text: 'Tab 1', url: '/1', state: JSON.stringify({ page: 'product' }) },
          { text: 'Tab 1', url: '/2', state: JSON.stringify({ page: 'product' }) }
        ]
      }
    })
    history = createMemoryHistory()
  })

  it('renders', () => {
    const component = (
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('uses prefetch', () => {
    app = AppModelBase.create({
      location,
      tabs: {
        items: [
          { text: 'Tab 1', url: '/1', state: JSON.stringify({ page: 'product' }), prefetch: 'always' },
          { text: 'Tab 1', url: '/2', state: JSON.stringify({ page: 'product' }), prefetch: 'visible' }
        ]
      }
    })

    const component = (
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the topNavClicked event when clicked', () => {
    const topNavClicked = jest.fn()
    configureAnalytics({ topNavClicked })

    mount(
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    )
      .find('[data-th="topNavClicked"]')
      .at(0)
      .simulate('click')    

    waitForAnalytics(() => expect(topNavClicked).toHaveBeenCalledWith({ item: app.tabs.items[0] }))
  })

  it('pushes the item state onto history when clicked', () => {
    mount(
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    )
      .find('button').at(0)
      .simulate('click')    

    expect(history.location.state).toEqual({ page: 'product' })
  })

  it('should always render absolute URLs', () => {
    const href = mount(
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    ).find('a').at(0).getDOMNode().getAttribute('href')

    expect(href).toEqual('https://example.com/1')
  })

  it('does not require history', () => {
    expect(mount(
      <Provider app={app} history={history}>
        <NavTabs/>
      </Provider>
    )).toMatchSnapshot()
  })

})