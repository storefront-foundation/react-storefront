/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import BackToTop from '../src/BackToTop'
import TestProvider from './TestProvider'

const CustomIcon = () => <i>X</i>

describe('BackToTop', () => {
  it('should render', () => {
    expect(
      mount(
        <TestProvider>
          <BackToTop />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render with custom icon', () => {
    expect(
      mount(
        <TestProvider>
          <BackToTop Icon={CustomIcon} />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })
})
