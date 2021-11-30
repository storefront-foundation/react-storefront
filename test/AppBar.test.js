import React from 'react'
import { mount } from 'enzyme'
import AppBar from 'react-storefront/AppBar'
import PWAContext from 'react-storefront/PWAContext'
import { MuiThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import createTheme from 'react-storefront/theme/createTheme'
import { Slide } from '@mui/material'

// Create a theme instance.
const theme = createTheme()

jest.useFakeTimers()

describe('AppBar', () => {
  let wrapper

  const Test = ({ offline = false, offlineMessage, ...others }) => {
    return (
      <PWAContext.Provider value={{ offline }}>
        <StyledEngineProvider injectFirst>
          <MuiThemeProvider theme={theme}>
            <AppBar offlineWarning={offlineMessage} {...others} />
          </MuiThemeProvider>
        </StyledEngineProvider>
      </PWAContext.Provider>
    );
  }

  it('should render offline message when offline', () => {
    const message = 'offlineTestMessage'
    wrapper = mount(<Test offlineMessage={message} offline />)
    expect(wrapper.find(AppBar).text()).toEqual(message)
  })

  it('should not render offline message when online', () => {
    const message = 'offlineTestMessage'
    wrapper = mount(<Test offlineMessage={message} />)
    expect(wrapper.find(AppBar).text()).toEqual('')
  })

  it('should slide in when fixed is false', () => {
    wrapper = mount(<Test />)
    expect(wrapper.find(Slide)).toHaveLength(1)
  })

  it('should not slide in when fixed is true', () => {
    wrapper = mount(<Test fixed />)
    expect(wrapper.find(Slide)).toHaveLength(0)
  })

  it('should accept variant="relative"', () => {
    wrapper = mount(<Test variant="relative" />)
    expect(wrapper.find(Slide)).toHaveLength(0)
  })

  // it('should not have any classes except wrap when not scrolled', async () => {
  //   window.scrollY = 0

  //   wrapper = mount(<Test />)

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   const classNames = getClassNames()

  //   expect(classNames).not.toContain('hidden')
  //   expect(classNames).not.toContain('stuck')
  // })

  // it('should not call scroll when fixed prop is passed', async () => {
  //   fixed = true

  //   wrapper = mount(<Test />)

  //   const classNames = getClassNames()

  //   expect(classNames).not.toContain('hidden')
  //   expect(classNames).not.toContain('unstuck')
  //   expect(classNames).toContain('fixed')
  //   expect(map.scroll).toBe(undefined)
  // })

  // it('should not show AppBar when scrolling down', async () => {
  //   wrapper = mount(<Test />)

  //   window.scrollY = 250
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('unstuck')
  // })

  // it('should show AppBar when scrolling up again', async () => {
  //   wrapper = mount(<Test />)

  //   window.scrollY = 0
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 250
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('unstuck')

  //   window.scrollY = 200

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).not.toContain('unstuck')
  // })

  // it('should not show AppBar  when scrolling up again less than buffer', async () => {
  //   wrapper = mount(<Test />)

  //   window.scrollY = 0
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 250
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('unstuck')

  //   window.scrollY = 240

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('unstuck')
  // })

  // it('should not hide AppBar when scrolling down less than buffer', async () => {
  //   wrapper = mount(<Test />)

  //   window.scrollY = 0
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 250
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 200

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 150 // If we breach 180(150 + buffer(30)) AppBar will disappear

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 170

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).not.toContain('unstuck') // AppBar is shown

  //   window.scrollY = 181 // 180 breached

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('unstuck') // AppBar not shown anymore, because scrolled more than buffer(buffer is 30)
  // })

  // it('should not have animate when going back to the top', async () => {
  //   wrapper = mount(<Test />)

  //   window.scrollY = 0
  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   window.scrollY = 250
  //   await act(async () => {
  //     await map.scroll()
  //     await jest.runAllTimers()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).toContain('animate')

  //   window.scrollY = 0

  //   await act(async () => {
  //     await map.scroll()
  //     await wrapper.update()
  //   })

  //   expect(getClassNames()).not.toContain('animate')
  // })
})
