import React from 'react'
import { mount } from 'enzyme'
import Breadcrumbs from 'react-storefront/Breadcrumbs'
import { Typography, Container } from '@mui/material'

describe('Breadcrumbs', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render empty span when no items provided', () => {
    wrapper = mount(<Breadcrumbs items={null} />)

    expect(wrapper.find(Container).children.length).toBe(1)
  })

  it('should apply bold style to last item', () => {
    const items = [{ text: 'test1' }, { text: 'test2' }]
    wrapper = mount(<Breadcrumbs items={items} />)

    expect(
      wrapper
        .findWhere(item => item.type() === 'span' && item.text() === 'test2')
        .prop('className'),
    ).toContain('current')
  })

  it('should render items with href as a link', () => {
    const items = [{ text: 'test1', href: '/test' }]
    wrapper = mount(<Breadcrumbs items={items} />)

    expect(wrapper.find('a').text()).toBe('test1')
  })
})
