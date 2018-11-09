/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import AmpExpandableSection from '../../src/amp/AmpExpandableSection'
import TestProvider from '../TestProvider'

describe('AmpExpandableSection', () => {
  it('should render', () => {
    expect(
      mount(
        <TestProvider>
          <AmpExpandableSection title="Title">Foo</AmpExpandableSection>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render expanded', () => {
    expect(
      mount(
        <TestProvider>
          <AmpExpandableSection title="Title" expanded>Foo</AmpExpandableSection>
        </TestProvider>
      )
    ).toMatchSnapshot()
  })
})