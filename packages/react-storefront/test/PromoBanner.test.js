/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import PromoBanner from '../src/PromoBanner'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import { configureAnalytics } from '../src/analytics'
import waitForAnalytics from './helpers/waitForAnalytics'
import AppModelBase from '../src/model/AppModelBase'

describe('PromoBanner', () => {

  let history, app

  beforeEach(() => {
    history = createMemoryHistory()
    app = AppModelBase.create()
  })

  it('renders', () => {
    const component = (
      <Provider history={history} app={app}>
        <PromoBanner/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the promo_banner_clicked event when clicked', () => {
    const promoBannerClicked = jest.fn()
    configureAnalytics({ promoBannerClicked })

    mount(
      <Provider history={history} app={app}>
        <PromoBanner name="promo" src="/promo.jpeg"/>
      </Provider>
    )
      .find('a').at(0)
      .simulate('click')    

    waitForAnalytics(() => {
      expect(promoBannerClicked).toHaveBeenCalledWith({
        name: 'promo',
        imageUrl: '/promo.jpeg'
      })
    })
  })

})