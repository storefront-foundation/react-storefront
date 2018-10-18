/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ImageSwitcher from '../src/ImageSwitcher'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'
import { MuiThemeProvider } from '@material-ui/core'
import createTheme from '../src/createTheme'
import AmpState from '../src/amp/AmpState'

describe('ImageSwitcher', () => {

  let app, theme

  beforeEach(() => {
    app = AppModelBase.create({})
    theme = createTheme({})
  })

  it('only shows images by default, no bells and whistles', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <Provider app={app}>
            <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} />
          </Provider>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render thumbnails', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <Provider app={app}>
            <ImageSwitcher
              images={['/a.jpg', '/b.jpg', '/c.jpg']}
              thumbnails={['/at.jpg', '/bt.jpg', '/ct.jpg']}
            />
          </Provider>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render arrows', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <Provider app={app}>
            <ImageSwitcher
              images={['/a.jpg', '/b.jpg', '/c.jpg']}
              arrows
            />
          </Provider>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render indicator dots', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <Provider app={app}>
            <ImageSwitcher
              images={['/a.jpg', '/b.jpg', '/c.jpg']}
              showIndicators
            />
          </Provider>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render AmpImageSwitcher when amp=true', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <Provider app={AppModelBase.create({ amp: true })} nextId={() => '1'}>
            <AmpState>
              <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} />
            </AmpState>
          </Provider>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should accept image objects and use given props', () => {
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Provider app={app}>
          <ImageSwitcher images={[{ src: 'test.jpg', alt: 'test' }]} />
        </Provider>
      </MuiThemeProvider>
    )
    expect(wrapper.find('img').first().prop('alt')).toBe('test')
  })

  it('should accept image objects and use given props in AMP', () => {
    const wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <Provider app={AppModelBase.create({ amp: true })} nextId={() => '1'}>
          <AmpState>
            <ImageSwitcher images={[{ src: 'test.jpg', alt: 'test' }]} />
          </AmpState>
        </Provider>
      </MuiThemeProvider>
    )
    expect(wrapper.find('amp-img').first().prop('alt')).toBe('test')
  });

})