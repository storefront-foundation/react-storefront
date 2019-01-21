/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import Breadcrumbs from '../src/Breadcrumbs'
import AppModelBase from '../src/model/AppModelBase'
import waitForAnalytics from './helpers/waitForAnalytics'
import { configureAnalytics } from '../src/analytics'

describe('Breadcrumbs', () => {

  it('renders', () => {
    const app = AppModelBase.create({
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/c/1', text: 'Category 1' },
        { text: 'Subcategory 1' }
      ]
    })
    expect(mount(
      <Provider app={app}>
        <Breadcrumbs/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders blank when no breadcrumbs are provided', () => {
    const app = AppModelBase.create({ })
    expect(mount(
      <Provider app={app}>
        <Breadcrumbs/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders blank when an empty array of breadcrumbs is provided', () => {
    const app = AppModelBase.create({ breadcrumbs: [] })
    expect(mount(
      <Provider app={app}>
        <Breadcrumbs/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('includes state in the link', () => {
    const app = AppModelBase.create({ breadcrumbs: [
      { url: '/', text: 'Home' },
      { url: '/c/1', text: 'Category 1', state: JSON.stringify({ loadingCategory: { title: 'Category 1' }}) },
      { text: 'Subcategory 1', state: JSON.stringify({ loadingSubcategory: { title: 'Subcategory 1' }}) }
    ] })
    expect(mount(
      <Provider app={app}>
        <Breadcrumbs/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should fire a breadcrumb_clicked event when clicked', () => {
    const breadcrumbClicked = jest.fn()

    configureAnalytics({ breadcrumbClicked })

    const app = AppModelBase.create({
      breadcrumbs: [
        { url: '/', text: 'Home' },
        { url: '/c/1', text: 'Category 1' },
        { text: 'Subcategory 1' }
      ]
    })

    const wrapper = mount(
      <Provider app={app}>
        <Breadcrumbs/>
      </Provider>
    )

    wrapper.find('a').at(0).simulate('click')

    waitForAnalytics(() => {
      expect(breadcrumbClicked).toHaveBeenCalledWith({
        "breadcrumb": {
          "text":  "Home",
          "url": "/",
          "state": null
        }
      })
    })

  })

})