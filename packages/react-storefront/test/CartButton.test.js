/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import CartButton from '../src/CartButton'
import AppModelBase from '../src/model/AppModelBase'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'
import { configureAnalytics } from '../src/analytics'
import waitForAnalytics from './helpers/waitForAnalytics'

describe('CartButton', () => {

  let app, history

  beforeEach(() => {
    app = AppModelBase.create({})
    history = createMemoryHistory()
  })

  it('renders', () => {
    const component = (
      <Provider app={app} history={history}>
        <CartButton/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('fires the view_cart event when clicked', () => {
    const cartClicked = jest.fn()
    configureAnalytics({ cartClicked })

    mount(
      <Provider app={app} history={history}>
        <CartButton/>
      </Provider>
    )
      .find('a').at(0)
      .simulate('click')    

    return waitForAnalytics(() => expect(cartClicked).toHaveBeenCalled())
  })

})

