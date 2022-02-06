import React from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import NavTab from 'react-storefront/nav/NavTab'
import Row from 'react-storefront/Row'
import Link from 'react-storefront/link/Link'
import { Hidden, Paper, Popover } from '@mui/material'
import HoverPopover from 'material-ui-popup-state/HoverPopover'
import {
  createTheme,
  ThemeProvider,
  StyledEngineProvider,
  adaptV4Theme,
} from '@mui/material/styles'
import { navigate } from '../mocks/mockRouter'
import { getFiberIndex } from '../methods'

describe('NavTab', () => {
  let wrapper, root

  afterEach(() => {
    document.body.removeChild(root)
    root = null
    wrapper.unmount()
    jest.clearAllMocks()
  })

  beforeEach(() => {
    // setImmediate seems to be much more stable than set timeout for tests, so we us it here to prevent intermittant failures
    jest.spyOn(global, 'setTimeout').mockImplementation(setImmediate)

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

  it('should hide and show Popover on mouseover and mouseleave from Tab', async () => {
    const theme = createTheme({ props: { MuiWithWidth: { initialWidth: 'md' } } })

    wrapper = mount(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
            <Row id="first">Subcategory 1</Row>
            <Row id="second">Subcategory 2</Row>
            <Row id="third">Subcategory 3</Row>
          </NavTab>
        </ThemeProvider>
      </StyledEngineProvider>,
      { attachTo: root },
    )

    expect(wrapper.find(Row).length).toBe(0)
    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(false)
    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('mouseover')
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(Row).length).toBe(3)
    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)

    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('mouseleave')
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(false)
  })

  it('should hide and show Menu when leaving and entering from Menu', async () => {
    const theme = createTheme({ props: { MuiWithWidth: { initialWidth: 'md' } } })

    wrapper = mount(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
            <Row id="first">Subcategory 1</Row>
            <Row id="first">Subcategory 2</Row>
            <Row id="first">Subcategory 3</Row>
          </NavTab>
        </ThemeProvider>
      </StyledEngineProvider>,
      { attachTo: root },
    )

    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(false)
    expect(wrapper.find(Paper).exists()).toBe(false)
    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('mouseover')
      setImmediate(() => wrapper.update())
    })
    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)
    expect(wrapper.find(Paper).exists()).toBe(true)

    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('mouseleave')
      setImmediate(() => wrapper.update())
    })
    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(false)
  })

  it.skip('should never show Popover when width is sm', async () => {
    const theme = createTheme({ props: { MuiWithWidth: { initialWidth: 'xs' } } })

    wrapper = mount(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
            <Row id="first">Subcategory 1</Row>
            <Row id="first">Subcategory 2</Row>
            <Row id="first">Subcategory 3</Row>
          </NavTab>
        </ThemeProvider>
      </StyledEngineProvider>,
      { attachTo: root },
    )

    expect(wrapper.find(Row).length).toBe(0)
    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('mouseover')
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(Row).length).toBe(0)
  })

  it('should close menu on page change', async () => {
    const theme = createTheme({ props: { MuiWithWidth: { initialWidth: 'lg' } } })

    wrapper = mount(
      <StyledEngineProvider injectFirst>
        <ThemeProvider theme={theme}>
          <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
            <Row id="first">Subcategory 1</Row>
            <Row id="first">Subcategory 2</Row>
            <Row id="first">Subcategory 3</Row>
          </NavTab>
        </ThemeProvider>
      </StyledEngineProvider>,
      { attachTo: root },
    )

    await act(async () => {
      await wrapper
        .find('.RSFNavTab-link')
        .last()
        .simulate('keydown', { key: 'Enter' })

      return new Promise(resolve => {
        setTimeout(() => {
          wrapper.update()
          resolve()
        })
      })
    })
    expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)
  })

  describe('accessibility', () => {
    beforeEach(() => {
      const theme = createTheme(
        adaptV4Theme({
          props: {
            MuiWithWidth: {
              initialWidth: 'lg',
            },
          },
        }),
      )

      wrapper = mount(
        <StyledEngineProvider injectFirst>
          <ThemeProvider theme={theme}>
            <NavTab id="tab1" href="/test1" as="/test1" key={1} label="test1">
              <div>
                <a href="/" id="sub1">
                  test1
                </a>
                <a href="/" id="sub2">
                  test2
                </a>
              </div>
            </NavTab>
          </ThemeProvider>
        </StyledEngineProvider>,
        { attachTo: root },
      )
    })

    it('should open the menu when the user presses enter', async () => {
      await act(async () => {
        await wrapper
          .find('.RSFNavTab-link')
          .last()
          .simulate('keydown', { key: 'Tab' })
        setImmediate(() => wrapper.update())
      })

      expect(wrapper.find(HoverPopover).first().prop('open')).toBe(false)

      await act(async () => {
        await wrapper
          .find('.RSFNavTab-link')
          .last()
          .simulate('keydown', { key: 'Enter' })
        setImmediate(() => wrapper.update())
      })

      expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)
    })

    it('should still be open after blurring out and focusing a new one', async () => {
      await act(async () => {
        await wrapper
          .find('.RSFNavTab-link')
          .last()
          .simulate('keydown', { key: 'Enter' })
        setImmediate(() => wrapper.update())
      })

      expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)

      await act(async () => {
        await wrapper
          .find('a')
          .first()
          .simulate('blur')
        setImmediate(() => wrapper.update())
        await wrapper
          .find('a')
          .last()
          .simulate('focus')
        setImmediate(() => wrapper.update())
      })

      expect(wrapper.find(HoverPopover).first().prop('open')).toBe(true)
    })
  })
})
