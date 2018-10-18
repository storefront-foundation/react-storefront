/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount, shallow } from 'enzyme'
import Drawer from '../src/Drawer'
import AmpState from '../src/amp/AmpState'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'

describe('Drawer', () => {

  it('accepts a className prop', () => {
    expect(mount(<Drawer className="myClassName" onRequestClose={Function.prototype}/>)).toMatchSnapshot()
  })

  it('accepts a paper class', () => {
    expect(mount(<Drawer classes={{ paper: 'myPaperClass' }} onRequestClose={Function.prototype}/>)).toMatchSnapshot()
  })

  it('uses a div for title', () => {
    expect(mount(<Drawer open title="Title" onRequestClose={Function.prototype}/>)).toMatchSnapshot()
  })

  it('spreads props to the underlying MuiDrawer', () => {
    // We MUST use Enzyme here because the DOM is used
    // And mount causes a invalid string length error. This may
    // be related to the enzyme-to-json library and may
    // be fixed in the future. For now, shallow will do.
    expect(shallow(<Drawer open onRequestClose={Function.prototype}/>)).toMatchSnapshot()
  })

  it('sets up amp-bind when ampBindClosed is set', () => {
    expect(mount(
      <Provider app={AppModelBase.create({ amp: true })}>
        <AmpState id="myState">
          <Drawer ampBindClosed="closed" onRequestClose={Function.prototype}/>
        </AmpState>
      </Provider>
    )).toMatchSnapshot()
  })
})