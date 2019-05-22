/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Menu from '../../src/Menu'
import MenuContext from '../../src/menu/MenuContext'
import Provider from '../TestProvider'
import AppModelBase from '../../src/model/AppModelBase'

describe('AmpSimpleMenu', () => {
  let app

  beforeEach(() => {
    app = AppModelBase.create({
      amp: true,
      location: {
        pathname: '/',
        search: '',
        hostname: 'localhost'
      },
      menu: {
        levels: [
          {
            root: true,
            items: [
              {
                text: 'Group 1',
                className: 'group-1',
                items: [
                  {
                    text: 'Item 1',
                    url: '/item1',
                    items: [{ text: 'Child 1', url: '/item1/child1' }]
                  }
                ]
              },
              {
                text: 'Group 2',
                className: 'group-2',
                items: [
                  {
                    text: 'Item 2',
                    url: '/item2',
                    items: [{ text: 'Child 2', url: '/item2/child2' }]
                  }
                ]
              }
            ]
          }
        ]
      }
    })
  })

  it('should render simple AMP menu', () => {
    const wrapper = mount(
      <Provider app={app}>
        <Menu simple />
      </Provider>
    )

    expect(wrapper.find('AmpSimpleMenu').length).toBe(1)

    expect(wrapper.find('amp-accordion').length).toBe(4)
  })

  it('should match simple AMP menu snap', () => {
    const wrapper = mount(
      <Provider app={app}>
        <Menu simple />
      </Provider>
    )
    expect(wrapper).toMatchSnapshot()
  })
})
