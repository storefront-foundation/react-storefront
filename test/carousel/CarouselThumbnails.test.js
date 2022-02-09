import React from 'react'
import { mount } from 'enzyme'
import CarouselThumbnails from 'react-storefront/carousel/CarouselThumbnails'
import { Tab, Tabs } from '@mui/material'
import * as useMediaQuery from '@mui/material/useMediaQuery'

describe('CarouselThumbnails', () => {
  let wrapper

  const mockMediaQuery = jest.fn().mockImplementation(()=> useMediaQuery())

  const thumbnails = [
    { src: 'test1', alt: 'test1' },
    { src: 'test2', alt: 'test2' },
    { src: 'test3', alt: 'test3' },
  ]

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render thumbnails', () => {
    wrapper = mount(<CarouselThumbnails selected={0} thumbnails={thumbnails} />)

    expect(wrapper.find(Tab).length).toBe(3)
  })

  it('should render thumbnails with proper orientation', () => {
    wrapper = mount(
      <CarouselThumbnails selected={0} thumbnails={thumbnails} thumbnailPosition="left" />,
    )
    expect(wrapper.find(Tabs).prop('orientation')).toBe('vertical')

    wrapper = mount(
      <CarouselThumbnails selected={0} thumbnails={thumbnails} thumbnailPosition="right" />,
    )
    expect(wrapper.find(Tabs).prop('orientation')).toBe('vertical')

    wrapper = mount(
      <CarouselThumbnails selected={0} thumbnails={thumbnails} thumbnailPosition="top" />,
    )
    expect(wrapper.find(Tabs).prop('orientation')).toBe('horizontal')

    wrapper = mount(
      <CarouselThumbnails selected={0} thumbnails={thumbnails} thumbnailPosition="bottom" />,
    )
    expect(wrapper.find(Tabs).prop('orientation')).toBe('horizontal')
  })

  it('should render thumbnails horizontally when screen size is small', () => {
    mockMediaQuery.mockReturnValue(true)

    wrapper = mount(
      <CarouselThumbnails selected={0} thumbnails={thumbnails} thumbnailPosition="left" />,
    )
    expect(wrapper.find(Tabs).prop('orientation')).toBe('vertical')
  })

  it('should change selected on thumbnail click', () => {
    const setSelectedSpy = jest.fn()

    wrapper = mount(
      <CarouselThumbnails selected={0} setSelected={setSelectedSpy} thumbnails={thumbnails} />,
    )

    wrapper
      .find('.MuiTab-root')
      .last()
      .simulate('click')
    expect(setSelectedSpy).toBeCalledWith(2)
  })
})
