/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ExpandableSection from '../src/ExpandableSection'
import createTheme from '../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core'
import { Provider } from 'mobx-react';
import AppModelBase from '../src/model/AppModelBase'

describe('ExpandableSection', () => {

  let theme

  beforeEach(() => {
    theme = createTheme()
  })

  it('should render', () => {
    const app = AppModelBase.create({ amp: false })

    expect(
      mount(
        <Provider app={app}>
          <MuiThemeProvider theme={theme}>
            <ExpandableSection title="Title">Foo</ExpandableSection>
          </MuiThemeProvider>
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render AmpExpandableSection when amp == true', () => {
    const app = AppModelBase.create({ amp: true })

    expect(
      mount(
        <Provider app={app}>
          <MuiThemeProvider theme={theme}>
            <ExpandableSection title="Title">Foo</ExpandableSection>
          </MuiThemeProvider>
        </Provider>
      )
    ).toMatchSnapshot()
  })
})