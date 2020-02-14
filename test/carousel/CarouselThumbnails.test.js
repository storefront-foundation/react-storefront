import React from 'react'
import { mount } from 'enzyme'
import CarouselThumbnails from 'react-storefront/carousel/CarouselThumbnails'
import { Tab } from '@material-ui/core'

describe('CarouselThumbnails', () => {
  let wrapper

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
