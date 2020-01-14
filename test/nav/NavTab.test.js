import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import NavTab from 'react-storefront/nav/NavTab'
import Row from 'react-storefront/Row'
import Link from 'react-storefront/link/Link'
import { Paper, Popover } from '@material-ui/core'
import { createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles'

describe('NavTab', () => {
  let wrapper, root

  afterEach(() => {
    document.body.removeChild(root)
    root = null
    wrapper.unmount()
  })

  beforeEach(() => {
    document.createRange = () => ({
      setStart: () => {},
      setEnd: () => {},
      commonAncestorContainer: {
        nodeName: 'BODY',
        ownerDocument: document,
      },
    })
    root = document.createElement('div')
    document.body.appendChild(root)
  })

  it('should render component', () => {
    wrapper = mount(<NavTab id="tab" href="/test" as="/test1" key={1} label="test1" />)

    expect(wrapper.find(NavTab).exists()).toBe(true)
  })

  it('should hide and show Popover on mouseenter and mouseleave from Tab', async () => {
    const theme = createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'md' } } })

    wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
          <Row id="first">Subcategory 1</Row>
          <Row id="first">Subcategory 2</Row>
          <Row id="first">Subcategory 3</Row>
        </NavTab>
      </MuiThemeProvider>,
      { attachTo: root },
    )

    expect(wrapper.find(Row).length).toBe(0)
    expect(wrapper.find(Popover).prop('open')).toBe(false)
    await act(async () => {
      await wrapper
        .find(Link)
        .first()
        .simulate('mouseenter')
      setImmediate(() => wrapper.update())
    })
    expect(wrapper.find(Row).length).toBe(3)
    expect(wrapper.find(Popover).prop('open')).toBe(true)

    await act(async () => {
      await wrapper
        .find(Link)
        .first()
        .simulate('mouseleave')
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(Popover).prop('open')).toBe(false)
  })

  it('should never show Popover when width is sm', async () => {
    const theme = createMuiTheme({ props: { MuiWithWidth: { initialWidth: 'xs' } } })

    wrapper = mount(
      <MuiThemeProvider theme={theme}>
        <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
          <Row id="first">Subcategory 1</Row>
          <Row id="first">Subcategory 2</Row>
          <Row id="first">Subcategory 3</Row>
        </NavTab>
      </MuiThemeProvider>,
      { attachTo: root },
    )

    expect(wrapper.find(Row).length).toBe(0)
    await act(async () => {
      await wrapper
        .find(Link)
        .first()
        .simulate('mouseenter')
      await wrapper.update()
    })

    expect(wrapper.find(Row).length).toBe(0)
  })

  describe('accessibility', () => {
    beforeEach(() => {
      const theme = createMuiTheme({
        props: {
          MuiWithWidth: {
            initialWidth: 'lg',
          },
        },
      })

      wrapper = mount(
        <MuiThemeProvider theme={theme}>
          <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
            <div>
              <a href="/" />
            </div>
          </NavTab>
        </MuiThemeProvider>,
        { attachTo: root },
      )
    })

    it('should open the menu when the user presses enter', async () => {
      expect(wrapper.find(Popover).prop('open')).toBe(false)

      await act(async () => {
        await wrapper
          .find(Link)
          .first()
          .simulate('keydown', { key: 'Enter' })
        await wrapper.update()
      })

      expect(wrapper.find(Popover).prop('open')).toBe(true)
    })

    it('should close the menu when the last menu item loses focus', async () => {
      await act(async () => {
        await wrapper
          .find(Link)
          .first()
          .simulate('keydown', { key: 'Enter' })
        await wrapper.update()
      })

      expect(wrapper.find(Popover).prop('open')).toBe(true)

      await act(async () => {
        await wrapper.find('a').simulate('blur')
        setImmediate(() => wrapper.update())
      })

      expect(wrapper.find(Popover).prop('open')).toBe(false)
    })
  })
})
