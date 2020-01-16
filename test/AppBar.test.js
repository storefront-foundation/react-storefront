import React from 'react'
import { mount } from 'enzyme'
import AppBar from 'react-storefront/AppBar'
import PWAContext from 'react-storefront/PWAContext'
import { eventListenersMock } from './mocks/mockHelper'
import { MuiThemeProvider } from '@material-ui/core/styles'
import { Toolbar } from '@material-ui/core'
import { act } from 'react-dom/test-utils'
import { createMuiTheme } from '@material-ui/core/styles'
import { red } from '@material-ui/core/colors'

// Create a theme instance.
const theme = createMuiTheme({
  palette: {
    primary: {
      main: '#556cd6',
    },
    secondary: {
      main: '#19857b',
    },
    error: {
      main: red.A400,
    },
    background: {
      default: '#fff',
    },
  },
  zIndex: {
    modal: 999,
    amp: {
      modal: 2147483646,
    },
  },
  headerHeight: 64,
  loadMaskOffsetTop: 64 + 56 + 4,
  drawerWidth: 330,
  margins: {
    container: 16,
  },
  overrides: {},
})

jest.useFakeTimers()

describe('AppBar', () => {
  const initialScrollY = window.scrollY
  let wrapper,
    offline,
    open,
    offlineMessage,
    fixed,
    map = {}

  const getClassNames = () =>
    wrapper
      .find(Toolbar)
      .parent()
      .prop('className')

  beforeEach(() => {
    eventListenersMock(map)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  afterEach(async () => {
    act(() => {
      jest.runAllTimers()
    })
    wrapper.unmount()
    window.scrollY = initialScrollY
    offline = undefined
    open = undefined
    offlineMessage = undefined
    fixed = undefined
    map = {}
  })

  const Test = () => {
    return (
      <PWAContext.Provider value={{ menu: { open }, offline }}>
        <MuiThemeProvider theme={theme}>
          <AppBar offlineWarning={offlineMessage} fixed={fixed} />
        </MuiThemeProvider>
      </PWAContext.Provider>
    )
  }

  it('should render offline message when offline', () => {
    offline = true
    offlineMessage = 'offlineTestMessage'
    wrapper = mount(<Test />)

    expect(wrapper.find(AppBar).text()).toBe(offlineMessage)
  })

  it('should not have any classes except wrap when not scrolled', async () => {
    window.scrollY = 0

    wrapper = mount(<Test />)

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    const classNames = getClassNames()

    expect(classNames).not.toContain('hidden')
    expect(classNames).not.toContain('stuck')
  })

  it('should not call scroll when fixed prop is passed', async () => {
    fixed = true

    wrapper = mount(<Test />)

    const classNames = getClassNames()

    expect(classNames).not.toContain('hidden')
    expect(classNames).not.toContain('unstuck')
    expect(classNames).toContain('fixed')
    expect(map.scroll).toBe(undefined)
  })

  it('should not show AppBar when scrolling down', async () => {
    wrapper = mount(<Test />)

    window.scrollY = 250
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('unstuck')
  })

  it('should show AppBar when scrolling up again', async () => {
    wrapper = mount(<Test />)

    window.scrollY = 0
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 250
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('unstuck')

    window.scrollY = 200

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).not.toContain('unstuck')
  })

  it('should not show AppBar  when scrolling up again less than buffer', async () => {
    wrapper = mount(<Test />)

    window.scrollY = 0
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 250
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('unstuck')

    window.scrollY = 240

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('unstuck')
  })

  it('should not hide AppBar when scrolling down less than buffer', async () => {
    wrapper = mount(<Test />)

    window.scrollY = 0
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 250
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 200

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 150 // If we breach 180(150 + buffer(30)) AppBar will disappear

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 170

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).not.toContain('unstuck') // AppBar is shown

    window.scrollY = 181 // 180 breached

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('unstuck') // AppBar not shown anymore, because scrolled more than buffer(buffer is 30)
  })

  it('should not have animate when going back to the top', async () => {
    wrapper = mount(<Test />)

    window.scrollY = 0
    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    window.scrollY = 250
    await act(async () => {
      await map.scroll()
      await jest.runAllTimers()
      await wrapper.update()
    })

    expect(getClassNames()).toContain('animate')

    window.scrollY = 0

    await act(async () => {
      await map.scroll()
      await wrapper.update()
    })

    expect(getClassNames()).not.toContain('animate')
  })
})
