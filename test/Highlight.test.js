import React from 'react'
import { mount } from 'enzyme'
import Highlight from 'react-storefront/Highlight'

describe('Highlight', () => {
  it('should not blow up if empty props', () => {
    const wrapper = mount(<Highlight />)
    expect(wrapper.text()).toBe('')
  })
  it('should not add highlights if no matches', () => {
    const wrapper = mount(<Highlight text="the fox jumps over" query="dog" />)
    expect(wrapper.text()).toBe('the fox jumps over')
  })
  it('should escape text', () => {
    const wrapper = mount(<Highlight text={`"foo" > 'bar' < zat`} />)
    expect(wrapper.text()).toBe('&quot;foo&quot; &gt; &#039;bar&#039; &lt; zat')
  })
  it('should add highlights to matches', () => {
    const wrapper = mount(
      <Highlight text="the fox jumps over the ox" query="ox" classes={{ highlight: 'foo' }} />,
    )
    const matches = wrapper.html().match(/<span class="foo">ox<\/span>/g)
    expect(matches.length).toBe(2)
  })
})
