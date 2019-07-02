/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import NavTabs from '../src/NavTabs'
import AnalyticsProvider from '../src/AnalyticsProvider'
import waitForAnalytics from './helpers/waitForAnalytics'
import Provider from './TestProvider'
import { createMemoryHistory } from 'history'
import { Router } from '../src/router'

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
          {
            text: 'Tab 1',
            url: '/1',
            state: JSON.stringify({ page: 'product' }),
            prefetch: 'always'
          },
          {
            text: 'Tab 1',
            url: '/2',
            state: JSON.stringify({ page: 'product' }),
            prefetch: 'visible'
          }
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
    const router = new Router()

    mount(
      <Provider app={app} router={router}>
        <AnalyticsProvider targets={() => [{ topNavClicked }]}>
          <NavTabs />
        </AnalyticsProvider>
      </Provider>
    )
      .find('[data-th="topNavClicked"]')
      .at(0)
      .simulate('click')

    return waitForAnalytics(() =>
      expect(topNavClicked).toHaveBeenCalledWith({
        item: {
          classes: { root: 'RSFTabsRow-tab-198 RSFNavTabs-tab-167' },
          className: null,
          expanded: false,
          image: null,
          items: null,
          lazyItemsURL: null,
          loading: false,
          prefetch: null,
          root: false,
          server: false,
          state: '{"page":"product"}',
          text: 'Tab 1',
          url: '/1'
        }
      })
    )
  })

  it('pushes the item state onto history when clicked', () => {
    const history = createMemoryHistory()
    const router = new Router()

    mount(
      <Provider app={app} history={history} router={router}>
        <NavTabs />
      </Provider>
    )
      .find('button')
      .at(0)
      .simulate('click')

    expect(history.location.state).toEqual({ page: 'product' })
  })

  it('should always render absolute URLs', () => {
    const href = mount(
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )
      .find('a')
      .at(0)
      .getDOMNode()
      .getAttribute('href')

    expect(href).toEqual('https://example.com/1')
  })

  it('should have all the necessary classes configured to prevent MUI warnings', () => {
    const component = (
      <Provider app={app}>
        <NavTabs />
      </Provider>
    )

    expect(
      mount(component)
        .render()
        .find('[class*="RSFNavTabs-tab-"]').length
    ).toBeGreaterThan(0)
  })

  it('does not require history', () => {
    expect(
      mount(
        <Provider app={app}>
          <NavTabs />
        </Provider>
      )
    ).toMatchSnapshot()
  })
})
