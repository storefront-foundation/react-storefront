/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import HeaderLogo from '../src/HeaderLogo'
import AppModelBase from '../src/model/AppModelBase'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import AnalyticsProvider from '../src/AnalyticsProvider'
import waitForAnalytics from './helpers/waitForAnalytics'

describe('HeaderLogo', () => {

  let app, history

  beforeEach(() => {
    app = AppModelBase.create({})
    history = createMemoryHistory()
  })

  it('renders', () => {
    const component = (
      <Provider app={app} history={history}>
        <HeaderLogo/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the logo_clicked event when clicked', () => {
    const logoClicked = jest.fn()

    mount(
      <Provider app={app} history={history}>
        <AnalyticsProvider targets={() => [{ logoClicked }]}>
          <HeaderLogo/>
        </AnalyticsProvider>
      </Provider>
    )
      .find('a').at(0)
      .simulate('click')    

    return waitForAnalytics(() => expect(logoClicked).toHaveBeenCalled())
  })

})