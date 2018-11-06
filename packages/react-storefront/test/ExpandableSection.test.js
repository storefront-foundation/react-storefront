/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ExpandableSection from '../src/ExpandableSection'
import createTheme from '../src/createTheme'
import TestProvider from './TestProvider'
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
        <TestProvider app={app}>
          <ExpandableSection title="Title">Foo</ExpandableSection>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render AmpExpandableSection when amp == true', () => {
    const app = AppModelBase.create({ amp: true })

    expect(
      mount(
        <TestProvider app={app}>
          <ExpandableSection title="Title">Foo</ExpandableSection>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })
})