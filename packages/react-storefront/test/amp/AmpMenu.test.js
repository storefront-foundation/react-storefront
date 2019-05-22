/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Menu from '../../src/amp/AmpMenu'
import MenuContext from '../../src/menu/MenuContext'
import Provider from '../TestProvider'
import AppModelBase from '../../src/model/AppModelBase'

describe('AmpMenu', () => {
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
              }
            ]
          }
        ]
      }
    })
  })

  it('should render AMP menu', () => {
    const wrapper = mount(
      <Provider app={app}>
        <MenuContext.Provider value={{ classes: {} }}>
          <Menu />
        </MenuContext.Provider>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()

    expect(
      wrapper
        .find('ItemContent')
        .at(0)
        .text()
    ).toBe('Group 1')

    expect(
      wrapper
        .find('ItemContent')
        .at(1)
        .text()
    ).toBe('Item 1')

    expect(
      wrapper
        .find('ItemContent')
        .at(2)
        .text()
    ).toBe('Child 1')
  })
})
