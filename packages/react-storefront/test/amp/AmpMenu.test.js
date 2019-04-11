/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import AmpMenu from '../../src/amp/AmpMenu'
import { mount } from 'enzyme'
import TestProvider from '../TestProvider'
import AppModelBase from '../../src/model/AppModelBase'

describe('AmpMenu', () => {
  it('should render', () => {
    const menu = {
      levels: [
        {
          root: true,
          items: [
            {
              text: 'Category 1',
              items: [
                {
                  text: 'Subcategory 1',
                  url: '/s/1',
                },
                {
                  text: 'Subcategory 2',
                  url: '/s/2',
                },
              ],
            },
            {
              text: 'Category 2',
              items: [
                {
                  text: 'Subcategory 1',
                  url: '/s/1',
                },
                {
                  text: 'Subcategory 2',
                  url: '/s/2',
                },
              ],
            },
          ],
        },
      ],
    }

    expect(
      mount(
        <TestProvider app={{ menu, amp: true }}>
          <AmpMenu />
        </TestProvider>,
      ),
    ).toMatchSnapshot()
  })

  describe('MenuItem.className', () => {
    const app = AppModelBase.create({
      location: {
        pathname: '/',
        search: '',
        hostname: 'localhost',
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
                    className: 'item-1',
                    items: [{ text: 'Child 1', url: '/item1/child1', className: 'child-1' }],
                  },
                ],
              },
            ],
          },
        ],
      },
    })

    const wrapper = mount(
      <TestProvider app={app}>
        <AmpMenu />
      </TestProvider>,
    )

    expect(wrapper.exists('.group-1')).toBe(true)
    expect(wrapper.exists('.child-1')).toBe(true)
    expect(wrapper.exists('.item-1')).toBe(true)
  })
})
