/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import AppBar from '../src/AppBar'
import createTheme from '../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'

describe("AppBar", () => {
  let theme

  beforeEach(function(){
    jest.spyOn(global.console, 'error').mockImplementation()
    theme = createTheme()
  })

  it('should render', () => {
    expect(mount(
      <Provider app={AppModelBase.create({})}>
        <MuiThemeProvider theme={theme}>
          <AppBar/>
        </MuiThemeProvider>
      </Provider>
    )).toMatchSnapshot()
  })
})