import React from 'react'
import { mount } from 'enzyme'
import DrawerCloseButton from 'react-storefront/drawer/DrawerCloseButton'
import { Fab, IconButton, Button } from '@material-ui/core'
import { Add as TestIcon } from '@material-ui/icons'

describe('DrawerCloseButton', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should appear as a Text button when text prop is passed', () => {
    wrapper = mount(<DrawerCloseButton text="test" />)
    expect(wrapper.find(Button)).toExist()
  })

  it('should appear as a Icon button when fullscreen prop is passed', () => {
    wrapper = mount(<DrawerCloseButton fullscreen />)
    expect(wrapper.find(IconButton)).toExist()
  })

  it('should appear as a Fab by default', () => {
    wrapper = mount(<DrawerCloseButton />)
    expect(wrapper.find(Fab)).toExist()
  })

  it('should be able to provide custom Icon', () => {
    wrapper = mount(<DrawerCloseButton fullscreen Icon={TestIcon} />)
    expect(wrapper.find(TestIcon)).toExist()
  })

  it('should be hidden when open is false in Fab', () => {
    wrapper = mount(<DrawerCloseButton />)
    expect(wrapper.find(Fab).prop('className')).toContain('hidden')
  })
})
