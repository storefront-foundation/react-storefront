/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import AmpExpandableSection from '../../src/amp/AmpExpandableSection'
import createTheme from '../../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core'

describe('AmpExpandableSection', () => {
  let theme

  beforeEach(() => {
    theme = createTheme()
  })

  it('should render', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <AmpExpandableSection title="Title">Foo</AmpExpandableSection>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render expanded', () => {
    expect(
      mount(
        <MuiThemeProvider theme={theme}>
          <AmpExpandableSection title="Title" expanded>Foo</AmpExpandableSection>
        </MuiThemeProvider>
      )
    ).toMatchSnapshot()
  })
})