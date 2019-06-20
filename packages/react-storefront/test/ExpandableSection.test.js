/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ExpandableSection from '../src/ExpandableSection'
import TestProvider from './TestProvider'
import AppModelBase from '../src/model/AppModelBase'

describe('ExpandableSection', () => {
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

  it('should render expanded when expanded=true', () => {
    const app = AppModelBase.create({ amp: true })

    expect(
      mount(
        <TestProvider app={app}>
          <ExpandableSection title="Title" expanded>
            Foo
          </ExpandableSection>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render expanded when defaultExpanded=true', () => {
    const app = AppModelBase.create({ amp: false })
    const wrapper = mount(
      <TestProvider app={app}>
        <ExpandableSection title="Title" defaultExpanded>
          Foo
        </ExpandableSection>
      </TestProvider>
    )
    expect(wrapper.getDOMNode().className.includes('MuiExpansionPanel-expanded')).toBe(true)
  })
})
