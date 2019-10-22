/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Accordion from '../src/Accordion'
import ExpandableSection from '../src/ExpandableSection'
import TestProvider from './TestProvider'
import AppContext from '../src/AppContext'
import AppModelBase from '../src/model/AppModelBase'

describe('Accordion', () => {
  it('should update which section is expanded', () => {
    const app = AppModelBase.create({})

    const wrapper = mount(
      <TestProvider>
        <AppContext.Provider value={{ app }}>
          <Accordion>
            <ExpandableSection title="a">A</ExpandableSection>
            <ExpandableSection title="b">B</ExpandableSection>
            <ExpandableSection title="c">C</ExpandableSection>
          </Accordion>
        </AppContext.Provider>
      </TestProvider>
    )

    expect(
      wrapper
        .find('ExpandableSection')
        .at(0)
        .prop('expandedSectionId')
    ).toEqual(null)

    wrapper
      .find('svg')
      .at(1)
      .simulate('click')

    expect(
      wrapper
        .find('ExpandableSection')
        .at(0)
        .prop('expandedSectionId')
    ).toEqual('b')
  })
})
