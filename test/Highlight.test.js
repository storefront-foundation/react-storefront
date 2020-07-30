import React from 'react'
import { mount } from 'enzyme'

describe('Highlight', () => {
  let wrapper, Highlight, mockAmp

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => mockAmp,
      }))
      Highlight = require('react-storefront/Highlight').default
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  afterAll(() => {
    jest.resetModules()
  })

  it('should not highlight in AMP mode', () => {
    mockAmp = true
    wrapper = mount(
      <Highlight text="the fox jumps over the ox" query="ox" classes={{ highlight: 'foo' }} />,
    )
    expect(wrapper.text()).toBe('the fox jumps over the ox')
  })
  it('should not blow up if empty props', () => {
    mockAmp = false
    wrapper = mount(<Highlight />)
    expect(wrapper.text()).toBe('')
  })
  it('should not add highlights if no matches', () => {
    mockAmp = false
    wrapper = mount(<Highlight text="the fox jumps over" query="dog" />)
    expect(wrapper.text()).toBe('the fox jumps over')
  })
  it('should escape text', () => {
    mockAmp = false
    wrapper = mount(<Highlight text={`"foo" > 'bar' < zat`} />)
    expect(wrapper.text()).toBe('&quot;foo&quot; &gt; &#039;bar&#039; &lt; zat')
  })
  it('should add highlights to matches', () => {
    mockAmp = false
    wrapper = mount(
      <Highlight text="the fox jumps over the ox" query="ox" classes={{ highlight: 'foo' }} />,
    )
    const matches = wrapper.html().match(/<span class="foo">ox<\/span>/g)
    expect(matches.length).toBe(2)
  })
})
