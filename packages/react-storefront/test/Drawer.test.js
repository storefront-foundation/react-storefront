/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount, shallow } from 'enzyme'
import Drawer from '../src/Drawer'
import AmpState from '../src/amp/AmpState'
import TestProvider from './TestProvider'

describe('Drawer', () => {

  it('accepts a className prop', () => {
    expect(mount(
      <TestProvider>
        <Drawer className="myClassName" onRequestClose={Function.prototype}/>
      </TestProvider>
    )).toMatchSnapshot()
  })

  it('accepts a paper class', () => {
    expect(mount(
      <TestProvider>
        <Drawer classes={{ paper: 'myPaperClass' }} onRequestClose={Function.prototype}/>
      </TestProvider>)).toMatchSnapshot()
  })

  it('uses a div for title', () => {
    expect(mount(
      <TestProvider>
        <Drawer open title="Title" onRequestClose={Function.prototype}/>
      </TestProvider>
    )).toMatchSnapshot()
  })

  it('spreads props to the underlying MuiDrawer', () => {
    // We MUST use Enzyme here because the DOM is used
    // And mount causes a invalid string length error. This may
    // be related to the enzyme-to-json library and may
    // be fixed in the future. For now, shallow will do.
    expect(mount(
      <TestProvider>
        <Drawer open onRequestClose={Function.prototype}/>
      </TestProvider>
    )).toMatchSnapshot()
  })

  it('sets up amp-bind when ampBindClosed is set', () => {
    expect(mount(
      <TestProvider app={{ amp: true }}>
        <AmpState id="myState">
          <Drawer ampBindClosed="closed" onRequestClose={Function.prototype}/>
        </AmpState>
      </TestProvider>
    )).toMatchSnapshot()
  })
})