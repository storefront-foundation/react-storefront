import React from 'react'
import { mount } from 'enzyme'
import { createTheme } from '@mui/material/styles'
import { ImageListItem } from '@mui/material'
import ResponsiveTiles from 'react-storefront/ResponsiveTiles'
import AutoScrollToNewChildren from 'react-storefront/AutoScrollToNewChildren'
import { makeStyles } from '@mui/styles'

jest.mock('@mui/styles');

describe('ResponsiveTiles', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })
  it('should render component', () => {
    wrapper = mount(<ResponsiveTiles />)

    expect(wrapper.find(ResponsiveTiles).exists()).toBe(true)
  })

  it('should wrap have when autoscroll prop is true', () => {
    wrapper = mount(
      <ResponsiveTiles>
        <div>Test</div>
      </ResponsiveTiles>,
    )

    expect(wrapper.find(AutoScrollToNewChildren).exists()).toBe(false)

    wrapper = mount(
      <ResponsiveTiles autoScrollToNewTiles>
        <div>Test</div>
      </ResponsiveTiles>,
    )

    expect(wrapper.find(AutoScrollToNewChildren).exists()).toBe(true)
  })

  it('should skip invalid elements', () => {
    wrapper = mount(
      <ResponsiveTiles>
        <div>Test1</div>
        <div>Test2</div>
        Test
      </ResponsiveTiles>,
    )

    expect(wrapper.find(ImageListItem).length).toBe(2)
  })

  it('should be able to pass custom spacing', () => {
    const theme = createTheme()
    const spacing = 2
    const root = document.createElement('div')
    document.body.appendChild(root)

    wrapper = mount(
      <ResponsiveTiles spacing={spacing}>
        <div id="test">Test1</div>
        <div>Test2</div>
      </ResponsiveTiles>,
      { attachTo: root },
    )

    expect(window.getComputedStyle(document.querySelector('ul')).margin).toBe(
      theme.spacing(-spacing),
    )
    expect(window.getComputedStyle(document.querySelector('li')).padding).toBe(
      theme.spacing(spacing),
    )
  })

  // makeStyles is deprecated in v5. 
  // Unfortunately, at the moment, I have not found an alternative solution to wait for styles that are dynamically added to the class
  it.skip('should be able to pass custom column breakpoints', () => {
    const theme = createMuiTheme()
    const root = document.createElement('div')
    document.body.appendChild(root)

    const makeStylesSpy = jest.spyOn(makeStyles, 'default')

    wrapper = mount(
      <ResponsiveTiles
        cols={{
          xs: 2,
          sm: 2,
          md: 2,
          lg: 2,
          xl: 2,
        }}
      >
        <div id="test">Test1</div>
        <div>Test2</div>
      </ResponsiveTiles>,
      { attachTo: root },
    )

    const tiles = Object.values(makeStylesSpy.mock.calls[0][0](theme).tile).map(item => item.width)

    tiles.forEach(tile => {
      if (tile) {
        expect(tile).toBe('50%')
      }
    })

    makeStylesSpy.mockClear()
  })
})
