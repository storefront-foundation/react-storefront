import React from 'react'
import { mount } from 'enzyme'
import SwipeableViews from 'react-swipeable-views'
import Carousel, {
  AutoPlaySwipeableViews,
  VirtualizeSwipeableViews,
  AutoPlayVirtualizeSwipeableViews,
} from 'react-storefront/carousel/Carousel'
import CarouselDots from 'react-storefront/carousel/CarouselDots'
import CarouselArrows from 'react-storefront/carousel/CarouselArrows'

describe('Carousel', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => null)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should by default have hidden touch arrows and Carousel dots', () => {
    wrapper = mount(
      <Carousel>
        <div>child1</div>
        <div>child2</div>
      </Carousel>,
    )

    expect(wrapper.find(CarouselDots)).toExist()
    expect(wrapper.find(CarouselArrows).prop('className')).toContain('hideTouchArrows')
  })

  it('should not have hidetouchArrows class when arrow prop is not desktop', () => {
    wrapper = mount(
      <Carousel arrows="all">
        <div>child1</div>
        <div>child2</div>
      </Carousel>,
    )

    expect(wrapper.find(CarouselArrows).prop('className')).toBe(null)
  })

  it('should create own useState if setSelected is not passed', () => {
    wrapper = mount(
      <Carousel indicators>
        <div>child1</div>
        <div>child2</div>
      </Carousel>,
    )

    expect(wrapper.find(CarouselArrows).prop('selected')).toBe(0)
  })

  it('should not create own useState if setSelected is passed', () => {
    const setSelectedSpy = jest.fn()

    wrapper = mount(
      <Carousel indicators selected={1} setSelected={setSelectedSpy}>
        <div>child1</div>
        <div>child2</div>
      </Carousel>,
    )

    expect(wrapper.find(CarouselArrows).prop('selected')).toBe(1)
    expect(wrapper.find(CarouselArrows).prop('setSelected')).toBe(setSelectedSpy)
  })

  it('should change selected when index changes', () => {
    wrapper = mount(
      <Carousel indicators>
        <div id="first">child1</div>
        <div id="second">child2</div>
      </Carousel>,
    )
    expect(wrapper.find(CarouselArrows).prop('selected')).toBe(0)
    expect(wrapper.find('#first')).toExist()
    expect(wrapper.find('#second')).not.toExist()

    wrapper.find(VirtualizeSwipeableViews).invoke('onChangeIndex')(1)

    expect(wrapper.find(CarouselArrows).prop('selected')).toBe(1)
    expect(wrapper.find('#first')).not.toExist()
    expect(wrapper.find('#second')).toExist()
  })

  it('should use SwipeableViews when not infinite nor autoplay', () => {
    wrapper = mount(
      <Carousel infinite={false}>
        <div id="foo">bar</div>
      </Carousel>,
    )
    expect(wrapper.find(SwipeableViews)).toExist()
  })

  it('should use VirtualizeSwipeableViews when infinite and not autoplay', () => {
    wrapper = mount(
      <Carousel>
        <div id="foo">bar</div>
      </Carousel>,
    )
    expect(wrapper.find(VirtualizeSwipeableViews)).toExist()
  })

  it('should use AutoPlaySwipeableViews when not infinite and autoplay', () => {
    wrapper = mount(
      <Carousel infinite={false} autoplay>
        <div id="foo">bar</div>
      </Carousel>,
    )
    expect(wrapper.find(AutoPlaySwipeableViews)).toExist()
  })

  it('should use AutoPlayVirtualizeSwipeableViews when infinite and autoplay', () => {
    wrapper = mount(
      <Carousel autoplay>
        <div id="foo">bar</div>
      </Carousel>,
    )
    expect(wrapper.find(AutoPlayVirtualizeSwipeableViews)).toExist()
  })
})
