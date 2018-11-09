import React from 'react'
import { mount } from 'enzyme'
import ExpandIcon from '@material-ui/icons/Add'
import CollapseIcon from '@material-ui/icons/Remove'
import MenuIcon from '../src/MenuIcon';

describe('MenuIcon', () => {

  it('should show the open icon when closed', () => {
    expect(
      mount(
        <MenuIcon/>
      )
    ).toMatchSnapshot()
  })

  it('should show the close icon when opened', () => {
    expect(
      mount(
        <MenuIcon open/>
      )
    ).toMatchSnapshot()
  })

  it('should accept custom icons', () => {
    expect(
      mount(
        <MenuIcon OpenIcon={ExpandIcon} CloseIcon={CollapseIcon}/>
      )
    ).toMatchSnapshot()
  })
  
})