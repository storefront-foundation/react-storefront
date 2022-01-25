import React from 'react'
import { mount } from 'enzyme'
import LoadMask from 'react-storefront/LoadMask'
import { CircularProgress } from '@mui/material'

describe('LoadMask', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <LoadMask>
        <div id="test1">test1</div>
      </LoadMask>,
    )

    expect(wrapper.find('#test1').text()).toBe('test1')
    expect(wrapper.find(CircularProgress).exists()).toBe(false)
  })

  it('should render loading circle when no children', () => {
    wrapper = mount(<LoadMask></LoadMask>)

    expect(wrapper.find(CircularProgress).exists()).toBe(true)
  })

  it('should apply correct classes on fullscreen prop', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<LoadMask fullscreen></LoadMask>, { attachTo: root })

    expect(
      wrapper
        .find('div')
        .first()
        .prop('className'),
    ).toContain('fullscreen')

    expect(window.getComputedStyle(document.body).overflow).toBe('visible')
  })

  it('should apply correct classes on show prop', () => {
    wrapper = mount(<LoadMask show></LoadMask>)

    expect(
      wrapper
        .find('div')
        .first()
        .prop('className'),
    ).toContain('show')
  })

  it('should apply correct classes on transparent prop', () => {
    wrapper = mount(<LoadMask transparent></LoadMask>)

    expect(
      wrapper
        .find('div')
        .first()
        .prop('className'),
    ).toContain('transparent')
  })

  it('should apply correct classes on align top prop', () => {
    wrapper = mount(<LoadMask align="top"></LoadMask>)

    expect(
      wrapper
        .find('div')
        .first()
        .prop('className'),
    ).toContain('alignTop')
  })

  it('should set overflow hidden when both fullscreen and show prop are provided', () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<LoadMask fullscreen show></LoadMask>, { attachTo: root })

    expect(window.getComputedStyle(document.body).overflow).toBe('hidden')
  })
})
