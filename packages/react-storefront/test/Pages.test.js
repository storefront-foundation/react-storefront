/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Pages from '../src/Pages'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import { createMemoryHistory } from 'history'
import TestProvider from './TestProvider'

describe('Pages', () => {

  it('displays the correct page', () => {
    const component = (
      <TestProvider app={{ page: 'Category' }}>
        <Pages
          components={{
            Product: () => <div>Product</div>,
            Category: () => <div>Category</div>
          }}
        />
      </TestProvider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('can display no page at all', () => {
    const component = (
      <TestProvider app={{ page: 'Foo' }}>
        <Pages
          components={{
            Product: () => <div>Product</div>,
            Category: () => <div>Category</div>
          }}
        />
      </TestProvider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('displays a custom default loading component', () => {
    const component = (
      <TestProvider app={{ page: 'Product', loading: true }}>
        <Pages
          loading={() => <div>Loading...</div>}
          components={{
            Product: () => <div>Product</div>,
            Category: () => <div>Category</div>
          }}
        />
      </TestProvider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('displays the default loading component', () => {
    const component = (
      <TestProvider app={{ page: 'Product', loading: true }}>
        <Pages
          components={{
            Product: () => <div>Product</div>
          }}
        />
      </TestProvider>
    )
    expect(mount(component)).toMatchSnapshot()
  })

  it('displays a custom skeleton', () => {
    const component = (
      <TestProvider app={{ page: 'Product', loading: true }}>
        <Pages
          loadMasks={{
            Product: () => <div id="product_load_mask">Loading Product...</div>
          }}
          components={{
            Product: () => <div>Product</div>
          }}
        />
      </TestProvider>
    )

    expect(mount(component).find('#product_load_mask').length).toBe(1)
  })

  it('caches the previous page in the dom', () => {
    const Product = () => <div id="product">Product</div>
    const Category = () => <div id="category">Category</div>
    const Loading = () => <div>Loading...</div>
    const app = AppModelBase.create({
      location: {
        pathname: '/',
        search: '',
        port: '80',
        hostname: 'localhost'
      },
      page: 'Product'
    })

    const wrapper = mount(
      <Provider app={app} history={createMemoryHistory()}>
        <Pages loading={Loading} components={{ Product, Category }} />
      </Provider>
    )

    app.applyState({ page: 'Category' })
    wrapper.update()
    expect(wrapper.find('#product').length).toBe(1)
    expect(wrapper.find('#category').length).toBe(1)
  })
})