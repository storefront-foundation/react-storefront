import React from 'react'
import { mount } from 'enzyme'
import CarouselDots from 'react-storefront/carousel/CarouselDots'

describe('CarouselDots', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render dots corresponding to count prop provided', () => {
    wrapper = mount(<CarouselDots count={3} selected={0} />)

    expect(
      wrapper
        .find('div')
        .filterWhere(
          el => !el.prop('className').includes('dots') && el.prop('className').includes('dot'),
        ).length,
    ).toBe(3)
  })

  it('should have dotSelected className', () => {
    wrapper = mount(<CarouselDots count={3} selected={0} />)

    expect(
      wrapper
        .find('div')
        .filterWhere(
          el => !el.prop('className').includes('dots') && el.prop('className').includes('dot'),
        )
        .first()
        .prop('className'),
    ).toContain('dotSelected')
  })
})
