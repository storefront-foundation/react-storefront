import React, { Component } from 'react'
import TestProvider from '../TestProvider'
import SEOLinks from '../../src/menu/SEOLinks'
import { mount } from 'enzyme'
import AppModelBase from '../../src/model/AppModelBase'

describe('SEOLinks', () => {
  it('should render links for all menu items', () => {
    const app = AppModelBase.create({
      menu: {
        levels: [
          {
            items: [
              { text: 'Group 1', items: [{ text: 'Item 1', url: '/item1' }] },
              { text: 'Item 2', url: '/item2' }
            ]
          }
        ]
      }
    })

    const wrapper = mount(
      <TestProvider app={app}>
        <SEOLinks />
      </TestProvider>
    )

    expect(wrapper.find('a[href="/item1"]').length).toBe(1)
    expect(wrapper.find('a[href="/item2"]').length).toBe(1)
  })
})
