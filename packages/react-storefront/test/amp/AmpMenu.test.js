/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import AmpMenu from '../../src/amp/AmpMenu'
import { mount } from 'enzyme'
import TestProvider from '../TestProvider'

describe('AmpMenu', () => {
  it('should render', () => {
    const menu = {
      levels: [{
        root: true,
        items: [{
          text: "Category 1",
          items: [{
            text: "Subcategory 1",
            url: "/s/1"
          }, {
            text: "Subcategory 2",
            url: "/s/2"
          }]
        }, {
          text: "Category 2",
          items: [{
            text: "Subcategory 1",
            url: "/s/1"
          }, {
            text: "Subcategory 2",
            url: "/s/2"
          }]
        }]
      }]
    }
  
    expect(
      mount(
        <TestProvider app={{ menu, amp: true }}>
          <AmpMenu/>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })
})