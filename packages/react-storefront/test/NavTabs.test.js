/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import NavTabs from '../src/NavTabs'
import { configureAnalytics } from '../src/analytics'
import waitForAnalytics from './helpers/waitForAnalytics'
import Provider from './TestProvider'
import { createMemoryHistory } from 'history'

describe('NavTabs', () => {

  let app, history, location

  beforeEach(() => {
    location = {
      procotol: 'https',
      hostname: 'example.com',
      pathname: '/',
      search: ''
    }

    app = {
      location,
      tabs: {
        items: [
          { text: 'Tab 1', url: '/1', state: JSON.stringify({ page: 'product' }) },
          { text: 'Tab 1', url: '/2', state: JSON.stringify({ page: 'product' }) }
        ]
      }
    }
  })

  it('renders', () => {
    const component = (
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('uses prefetch', () => {
    app = {
      location,
      tabs: {
        items: [
          { text: 'Tab 1', url: '/1', state: JSON.stringify({ page: 'product' }), prefetch: 'always' },
          { text: 'Tab 1', url: '/2', state: JSON.stringify({ page: 'product' }), prefetch: 'visible' }
        ]
      }
    }

    const component = (
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the topNavClicked event when clicked', () => {
    const topNavClicked = jest.fn()
    configureAnalytics({ topNavClicked })

    mount(
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )
      .find('[data-th="topNavClicked"]')
      .at(0)
      .simulate('click')

    waitForAnalytics(() => expect(topNavClicked).toHaveBeenCalledWith({
      "item": {
        "expanded": false, 
        "image": null, 
        "items": null, 
        "prefetch": null, 
        "root": false, 
        "server": false, 
        "state": "{\"page\":\"product\"}", 
        "text": "Tab 1", 
        "url": "/1"
      }
    }))
  })

  it('pushes the item state onto history when clicked', () => {
    const history = createMemoryHistory()

    mount(
      <Provider app={app} history={history}>
        <NavTabs />
      </Provider>
    )
      .find('button').at(0)
      .simulate('click')

    expect(history.location.state).toEqual({ page: 'product' })
  })

  it('should always render absolute URLs', () => {
    const href = mount(
      <Provider app={app}>
        <NavTabs />
      </Provider>
    ).find('a').at(0).getDOMNode().getAttribute('href')

    expect(href).toEqual('https://example.com/1')
  })

  it('does not require history', () => {
    expect(mount(
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )).toMatchSnapshot()
  })

})