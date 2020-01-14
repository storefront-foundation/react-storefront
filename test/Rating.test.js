import React from 'react'
import { mount } from 'enzyme'
import Rating from 'react-storefront/Rating'
import { Star, StarBorder, StarHalf, Pets as Test } from '@material-ui/icons'

describe('Rating', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render component', () => {
    wrapper = mount(<Rating />)

    expect(wrapper.find(Rating).exists()).toBe(true)
  })

  it('should have default label when reviewCount provided', () => {
    wrapper = mount(<Rating reviewCount={10} value={1.5} />)

    expect(
      wrapper
        .findWhere(n => n.prop('className') && n.prop('className').includes('reviewsLabel'))
        .first()
        .text(),
    ).toBe('(10 reviews)')

    wrapper = mount(<Rating reviewCount={1} value={1.5} />)

    expect(
      wrapper
        .findWhere(n => n.prop('className') && n.prop('className').includes('reviewsLabel'))
        .first()
        .text(),
    ).toBe('(1 review)')
  })

  it('should accept custom label', () => {
    wrapper = mount(
      <Rating
        reviewCount={10}
        value={1.5}
        label={count => <div id="countId">{`testCount:${count}`}</div>}
      />,
    )

    expect(wrapper.find('#countId').text()).toBe('testCount:10')
  })

  it('should take value and reviewCount from product', () => {
    wrapper = mount(<Rating product={{ reviewCount: 10, rating: 1.5 }} />)

    expect(
      wrapper
        .findWhere(n => n.prop('className') && n.prop('className').includes('reviewsLabel'))
        .first()
        .text(),
    ).toBe('(10 reviews)')

    // 1 full star, 1 half star and 3 empty star === rating 1.5
    expect(wrapper.find(Star).length).toBe(1)
    expect(wrapper.find(StarHalf).length).toBe(1)
    expect(wrapper.find(StarBorder).length).toBe(3)
  })

  it('should accept fillEmpty prop', () => {
    wrapper = mount(<Rating product={{ reviewCount: 10, rating: 1 }} fillEmpty />)

    expect(
      wrapper
        .find(Star)
        .filterWhere(n => n.prop('className') && n.prop('className').includes('filledEmpty'))
        .length,
    ).toBe(4)
  })

  it('should accept custom icons', () => {
    wrapper = mount(
      <Rating
        product={{ reviewCount: 10, rating: 1.5 }}
        iconEmpty={() => <Test />}
        iconFull={() => <div id="testFull" />}
        iconHalf={() => <div id="testHalf" />}
      />,
    )

    expect(wrapper.find(Test).length).toBe(3)
    expect(wrapper.find('#testFull').length).toBe(1)
    expect(wrapper.find('#testHalf').length).toBe(1)
  })
})
