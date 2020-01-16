import React from 'react'
import { mount } from 'enzyme'
import Fill from 'react-storefront/Fill'

describe('Fill', () => {
  let wrapper

  afterEach(() => {
    if (wrapper.exists()) {
      wrapper.unmount()
    }
  })

  it('should be able to spread props', () => {
    wrapper = mount(
      <Fill testprops="testprops">
        <div id="test1">test1</div>
      </Fill>,
    )

    expect(wrapper.find(Fill).prop('testprops')).toBe('testprops')
    expect(wrapper.find('#test1').text()).toBe('test1')
  })

  it('should return error when more than 1 child provided', () => {
    const container = document.createElement('div')
    expect(() =>
      ReactDOM.render(
        <Fill>
          <div id="test1">test1</div>
          <div id="test2">test2</div>
        </Fill>,
        container,
      ),
    ).toThrow()
  })

  it('should set right padding top when height is provided', () => {
    wrapper = mount(
      <Fill height="20%">
        <div></div>
      </Fill>,
    )

    expect(
      wrapper
        .find('div')
        .filterWhere(n => n.prop('style'))
        .first()
        .prop('style').paddingTop,
    ).toBe('20%')
  })
})
