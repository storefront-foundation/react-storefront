import React from 'react'
import { mount } from 'enzyme'
import Fill from 'react-storefront/Fill'

describe('Fill', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should be able to spread props', () => {
    wrapper = mount(<Fill testprops="testprops" />)

    expect(wrapper.find(Fill).prop('testprops')).toBe('testprops')
  })

  it('should render children', () => {
    wrapper = mount(
      <Fill>
        <div id="test1">test1</div>
        <div id="test2">test2</div>
      </Fill>,
    )

    expect(wrapper.find('#test1').text()).toBe('test1')
    expect(wrapper.find('#test2').text()).toBe('test2')
  })

  it('should set right padding top when aspectRatio is provided', () => {
    wrapper = mount(<Fill height="20%" />)

    expect(
      wrapper
        .find('div')
        .filterWhere(n => n.prop('style'))
        .first()
        .prop('style').paddingTop,
    ).toBe('20%')
  })
})
