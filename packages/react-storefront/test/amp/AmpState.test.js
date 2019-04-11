/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import AmpState from '../../src/amp/AmpState'
import { Provider } from 'mobx-react'
import { mount } from 'enzyme'

describe('AmpState', () => {
  it('should render an amp-state when amp is true', () => {
    expect(
      mount(
        <Provider app={{ amp: true }}>
          <AmpState initialState={{ foo: 'bar' }}>
            <div>inner</div>
          </AmpState>
        </Provider>,
      ),
    ).toMatchSnapshot()
  })
  it('should render only children when amp is false', () => {
    expect(
      mount(
        <Provider app={{ amp: false }}>
          <AmpState>
            <div>inner</div>
          </AmpState>
        </Provider>,
      ),
    ).toMatchSnapshot()
  })
})
