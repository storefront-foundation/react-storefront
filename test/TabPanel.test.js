/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import TabPanel from 'react-storefront/TabPanel'
import { Tab } from '@material-ui/core'

describe('TabPanel', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render the component', () => {
    wrapper = mount(
      <TabPanel>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>,
    )
    expect(wrapper.exists()).toBe(true)
  })

  it('should have expected amount of tabs', () => {
    wrapper = mount(
      <TabPanel>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>,
    )
    expect(wrapper.find(Tab).length).toBe(2)
  })

  it('should have right tab names', () => {
    wrapper = mount(
      <TabPanel>
        <div label="Test">TestContent</div>
        <div label="Test2">Test2Content</div>
      </TabPanel>,
    )
    expect(
      wrapper
        .find(Tab)
        .first()
        .text(),
    ).toBe('Test')
    expect(
      wrapper
        .find(Tab)
        .last()
        .text(),
    ).toBe('Test2')
  })

  it('should be able to set default selected tab', () => {
    wrapper = mount(
      <TabPanel selected={1}>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>,
    )
    expect(
      wrapper
        .find(Tab)
        .first()
        .prop('selected'),
    ).toBe(false)
    expect(
      wrapper
        .find(Tab)
        .last()
        .prop('selected'),
    ).toBe(true)
  })

  it('should change tabs on tab click', () => {
    wrapper = mount(
      <TabPanel>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>,
    )
    expect(
      wrapper
        .find(Tab)
        .last()
        .prop('selected'),
    ).toBe(false)

    wrapper
      .find(Tab)
      .last()
      .simulate('click')

    expect(
      wrapper
        .find(Tab)
        .last()
        .prop('selected'),
    ).toBe(true)
  })

  it('should hide not selected panels', () => {
    wrapper = mount(
      <TabPanel selected={0}>
        <div label="Test">TestContent</div>
        <div label="Test2">Test2Content</div>
      </TabPanel>,
    )

    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .first()
        .prop('className')
    ).not.toContain('hidden')
    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .last()
        .prop('className')
    ).toContain('hidden')
  })

  it('should set clicked panel to visible on click', () => {
    wrapper = mount(
      <TabPanel selected={0}>
        <div label="Test">TestContent</div>
        <div label="Test2">Test2Content</div>
      </TabPanel>,
    )
    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .last()
        .prop('className')
    ).toContain('hidden')
    wrapper
      .find(Tab)
      .last()
      .simulate('click')

    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .last()
        .prop('className')
    ).not.toContain('hidden')
    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .last()
        .text()
    ).toBe('Test2Content')
  })

  it('should trigger provided onChange callback when chaning tabs', () => {
    let changed = false

    const TestComponent = () => {
      const handleChange = () => (changed = true)

      return (
        <TabPanel selected={0} scrollable={false} onChange={handleChange}>
          <div label="Test">TestContent</div>
          <div label="Test2">Test2Content</div>
        </TabPanel>
      )
    }

    wrapper = mount(<TestComponent />)

    expect(changed).toBe(false)
    wrapper
      .find(Tab)
      .last()
      .simulate('click')

    expect(changed).toBe(true)
  })

  it('should be able to pass custom renderPanel fn', () => {
    const testRender = jest.fn().mockImplementation(item => item)

    wrapper = mount(
      <TabPanel renderPanels={testRender}>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>
    )
    expect(testRender).toHaveBeenCalledTimes(1)
  })

  it('should be able to pass props to panel with panelProps fn', () => {
    wrapper = mount(
      <TabPanel panelProps={({ child, index, selected }) => ({ testprops: 'testProps' })}>
        <div label="Test">Test</div>
        <div label="Test2">Test2</div>
      </TabPanel>
    )
    expect(
      wrapper
        .find({ role: 'tabpanel' })
        .first()
        .prop('testprops')
    ).toBe('testProps')
  })
})
