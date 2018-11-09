/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import AppBar from '../src/AppBar'
import TestProvider from './TestProvider'

describe("AppBar", () => {

  beforeEach(function(){
    jest.spyOn(global.console, 'error').mockImplementation()
  })

  it('should render', () => {
    expect(mount(
      <TestProvider>
        <AppBar/>
      </TestProvider>
    )).toMatchSnapshot()
  })
})