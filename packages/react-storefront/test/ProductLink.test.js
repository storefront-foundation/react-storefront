/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ProductLink from '../src/ProductLink'
import ProductModelBase from '../src/model/ProductModelBase'
import AppModelBase from '../src/model/AppModelBase'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import { createMemoryHistory } from 'history'

describe('ProductLink', () => {
  let history, app

  beforeEach(() => {
    history = createMemoryHistory()
    app = AppModelBase.create({
      location: {
        procotol: 'https',
        hostname: 'example.com',
        pathname: '/',
        search: ''
      }
    })
  })
  it('should include the product state', () => {
    const product = ProductModelBase.create({ id: "1", name: "Product", url: '/p/1', thumbnail: "https://example.com/p/1.jpeg" })

    mount(
      <Provider history={history} app={app}>
        <ProductLink product={product}>{product.name}</ProductLink>
      </Provider>
    )
      .find('a').at(0)
      .simulate('click')

    expect(history.location.state).toEqual({ 
      page: 'Product',
      loadingProduct: product.toJSON()
    })

    expect(history.location.pathname).toBe('/p/1')
  })

  it('should accept a to prop', () => {
    const product = ProductModelBase.create({ id: "1", name: "Product", url: '/p/1', thumbnail: "https://example.com/p/1.jpeg" })

    mount(
      <Provider history={history} app={app}>
        <ProductLink product={product} to="/foo/bar">{product.name}</ProductLink>
      </Provider>
    )
      .find('a').at(0)
      .simulate('click')

    expect(history.location.state).toEqual({ 
      page: 'Product',
      loadingProduct: product.toJSON()
    })

    expect(history.location.pathname).toBe('/foo/bar')
  })
})