import React from 'react'
import { mount } from 'enzyme'
// import ExpandIcon from '@material-ui/icons/Add'
// import CollapseIcon from '@material-ui/icons/Remove'
import TestProvider from './TestProvider'
import MenuIcon from '../src/MenuIcon'

describe('MenuIcon', () => {
  it('should show the open icon when closed', () => {
    expect(
      mount(
        <TestProvider app={{}}>
          <MenuIcon />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should show the close icon when opened', () => {
    expect(
      mount(
        <TestProvider app={{}}>
          <MenuIcon open />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render a label', () => {
    expect(
      mount(
        <TestProvider app={{}}>
          <MenuIcon label />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render AMP version of closed menu icon', () => {
    expect(
      mount(
        <TestProvider app={{ amp: true }}>
          <MenuIcon />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('should render AMP version of open menu icon', () => {
    expect(
      mount(
        <TestProvider app={{ amp: true }}>
          <MenuIcon open />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })
})
