import React from 'react'
import { mount } from 'enzyme'
import Drawer from 'react-storefront/drawer/Drawer'
import DrawerCloseButton from 'react-storefront/drawer/DrawerCloseButton'
import { Typography } from '@mui/material'

describe('Drawer', () => {
  let wrapper

  const originalStyle = document.body.style

  afterAll(() => {
    jest.restoreAllMocks()
  })

  afterEach(() => {
    document.body.style = originalStyle
    wrapper.unmount()
  })

  it('should set padding to 0 on drawer close', () => {
    const onClose = jest.fn()

    wrapper = mount(
      <Drawer title="test" onClose={onClose} open>
        <div></div>
      </Drawer>,
    )

    wrapper.find('.RSFDrawer-closeButton').last().simulate('click')

    expect(document.body.style.paddingBottom).toBe('0px')
  })

  it('should have title if title prop is passed', () => {
    wrapper = mount(
      <Drawer title="test" open>
        <div></div>
      </Drawer>,
    )

    expect(wrapper.find(Typography).text()).toBe('test')
  })

  it('should not render anything when it is closed', () => {
    wrapper = mount(
      <Drawer title="test">
        <div></div>
      </Drawer>,
    )

    expect(wrapper.find(Typography)).not.toExist()
  })

  it('should not show Drawer close button when showCloseButton is false', () => {
    wrapper = mount(
      <Drawer title="test" showCloseButton={false} open>
        <div></div>
      </Drawer>,
    )

    expect(wrapper.find(DrawerCloseButton)).not.toExist()
  })

  it('should show Drawer close button by default', () => {
    wrapper = mount(
      <Drawer title="test" open>
        <div></div>
      </Drawer>,
    )

    expect(wrapper.find(DrawerCloseButton)).toExist()
  })

  it('should auto adjust body padding when autoAdjustBodyPadding prop is passed', () => {
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb())
    const clientHeightMock = jest.spyOn(HTMLElement.prototype, 'clientHeight', 'get')

    clientHeightMock.mockReturnValue(10)
    wrapper = mount(
      <Drawer title="test" variant="persistent" autoAdjustBodyPadding open>
        <div></div>
      </Drawer>,
    )

    expect(document.body.style.paddingBottom).toBe(`10px`)

    const { instance } = ResizeObserver
    clientHeightMock.mockReturnValue(20)

    instance.callback()

    expect(document.body.style.paddingBottom).toBe(`20px`)

    jest.clearAllMocks()
  })

  it('should call onClose function when drawer is closed', () => {
    const onCloseMock = jest.fn()
    wrapper = mount(
      <Drawer title="test" variant="persistent" open onClose={onCloseMock}>
        <div></div>
      </Drawer>,
    )

    expect(document.body.style.paddingBottom).toBe('')

    wrapper.find('.RSFDrawer-closeButton').last().simulate('click')

    expect(document.body.style.paddingBottom).toBe('0px')

    expect(onCloseMock).toBeCalled()
  })
})
