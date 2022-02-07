import React from 'react'
import { mount } from 'enzyme'
import { ChevronLeft, ChevronRight } from '@mui/icons-material'
import CarouselArrows from 'react-storefront/carousel/CarouselArrows'
import { getFiberIndex } from '../methods'

describe('CarouselArrows', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render both left arrow and right arrow', () => {
    wrapper = mount(<CarouselArrows count={3} selected={1} setSelected={jest.fn()} />)

    expect(wrapper.find(ChevronLeft)).toExist()
    expect(wrapper.find(ChevronRight)).toExist()
  })

  it('should render only left arrow', () => {
    wrapper = mount(<CarouselArrows count={2} selected={1} setSelected={jest.fn()} />)

    expect(wrapper.find(ChevronLeft)).toExist()
    expect(wrapper.find(ChevronRight)).not.toExist()
  })

  it('should render only right arrow', () => {
    wrapper = mount(<CarouselArrows count={2} selected={0} setSelected={jest.fn()} />)

    expect(wrapper.find(ChevronLeft)).not.toExist()
    expect(wrapper.find(ChevronRight)).toExist()
  })

  it('should append one index when clicking on right arrow', () => {
    const setSelectedMock = jest.fn()

    wrapper = mount(<CarouselArrows count={2} selected={0} setSelected={setSelectedMock} />)

    wrapper.find('.MuiSvgIcon-root').at(getFiberIndex(0)).simulate('click')
    expect(setSelectedMock).toBeCalledWith(1)
  })

  it('should subtract one index when clicking on left arrow', () => {
    const setSelectedMock = jest.fn()

    wrapper = mount(<CarouselArrows count={2} selected={1} setSelected={setSelectedMock} />)

    wrapper.find('.MuiSvgIcon-root').at(getFiberIndex(0)).simulate('click')
    expect(setSelectedMock).toBeCalledWith(0)
  })
})
