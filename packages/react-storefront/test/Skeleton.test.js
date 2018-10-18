/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { ImageSwitcher } from '../src/Skeleton'
import AppModelBase from '../src/model/AppModelBase'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
import createTheme from '../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core/styles'

describe('Skeleton', () => {
  describe('ImageSwitcher', () => {
    let app, theme

    beforeEach(() => {
      theme = createTheme()
      app = AppModelBase.create({
        product: {
          id: "1",
          name: "Foo"
        },
        productThumbnail: '/foo/bar.png'
      })
    })

    it('should include thumbnails by default', () => {
      expect(
        mount(
          <MuiThemeProvider theme={theme}>
            <Provider app={app}>
              <ImageSwitcher/>
            </Provider>
          </MuiThemeProvider>
        )
      ).toMatchSnapshot()
    })

    it('should include hide thumbnails when thumbnails=false', () => {
      expect(
        mount(
          <MuiThemeProvider theme={theme}>
            <Provider app={app}>
              <ImageSwitcher thumbnails={false}/>
            </Provider>
          </MuiThemeProvider>
        )
      ).toMatchSnapshot()
    })
  })
})