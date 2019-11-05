/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import PromoBanner from '../src/PromoBanner'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import waitForAnalytics from './helpers/waitForAnalytics'
import AppModelBase from '../src/model/AppModelBase'
import AnalyticsProvider from '../src/AnalyticsProvider'

describe('PromoBanner', () => {
  let history, app

  beforeEach(() => {
    history = createMemoryHistory()
    app = AppModelBase.create()
  })

  it('renders', () => {
    const component = (
      <Provider history={history} app={app}>
        <PromoBanner />
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the promo_banner_clicked event when clicked', () => {
    const promoBannerClicked = jest.fn()

    mount(
      <Provider history={history} app={app}>
        <AnalyticsProvider targets={() => [{ promoBannerClicked }]}>
          <PromoBanner name="promo" src="/promo.jpeg" />
        </AnalyticsProvider>
      </Provider>
    )
      .find('a')
      .at(0)
      .simulate('click')

    return waitForAnalytics(() => {
      expect(promoBannerClicked).toHaveBeenCalledWith({
        name: 'promo',
        imageUrl: '/promo.jpeg',
        metadata: expect.anything()
      })
    })
  })
})
