import * as useMediaQuery from '@material-ui/core/useMediaQuery/useMediaQuery'
import React from 'react'
import { mount } from 'enzyme'
import CarouselThumbnails from 'react-storefront/carousel/CarouselThumbnails'
import { Tab, Tabs } from '@material-ui/core'

describe('CarouselThumbnails', () => {
  let wrapper

  const mockMediaQuery = jest.spyOn(useMediaQuery, 'default')

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
    expect(wrapper.find(Tabs).prop('orientation')).toBe('horizontal')
  })

  it('should change selected on thumbnail click', () => {
    const setSelectedSpy = jest.fn()

    wrapper = mount(
      <CarouselThumbnails selected={0} setSelected={setSelectedSpy} thumbnails={thumbnails} />,
    )

    wrapper
      .find(Tab)
      .last()
      .simulate('click')
    expect(setSelectedSpy).toBeCalledWith(2)
  })
})
