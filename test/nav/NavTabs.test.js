import React from 'react'
import { mount } from 'enzyme'
import NavTab from 'react-storefront/nav/NavTab'
import NavTabs from 'react-storefront/nav/NavTabs'
import { Tabs } from '@material-ui/core'
import { useRouter } from '../mocks/mockRouter'

describe('NavTabs', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    useRouter.mockReturnValue({ asPath: '/test' })
  })

  it('should render component', () => {
    wrapper = mount(<NavTabs />)

    expect(wrapper.find(NavTabs).exists()).toBe(true)
  })

  it('should render children', () => {
    wrapper = mount(
      <NavTabs>
        <NavTab id="tab" href="/test" as="/test1" key={1} label="test1" />
        <NavTab id="tab" href="/test2" as="/test2" key={2} label="test2" />
      </NavTabs>,
    )

    expect(wrapper.find(NavTab).length).toBe(2)
  })

  it('should set tab as selected if current page matches tab path', () => {
    wrapper = mount(
      <NavTabs>
        <NavTab id="tab" href="/test" as="/test2" key={1} label="test1" />
        <NavTab id="tab" href="/test2" as="/test" key={2} label="test2" />
      </NavTabs>,
    )

    expect(
      wrapper
        .find(Tabs)
        .first()
        .prop('value'),
    ).toBe(1)
  })

  it('should spread props to tabs', () => {
    const spreadprop = 'spreadprop'

    wrapper = mount(
      <NavTabs spreadprop={spreadprop}>
        <NavTab id="tab" href="/test" as="/test2" key={1} label="test1" />
        <NavTab id="tab" href="/test2" as="/test" key={2} label="test2" />
      </NavTabs>,
    )

    expect(
      wrapper
        .find(Tabs)
        .first()
        .prop(spreadprop),
    ).toBe(spreadprop)
  })

  it('should spread classes to tabs', () => {
    const centered = 'centered'

    wrapper = mount(
      <NavTabs scrollButtons="on" classes={{ centered }}>
        <NavTab id="tab" href="/test" as="/test2" key={1} label="test1" />
        <NavTab id="tab" href="/test2" as="/test" key={2} label="test2" />
      </NavTabs>,
    )

    expect(
      wrapper
        .find(Tabs)
        .first()
        .prop('classes').centered,
    ).toBe(centered)
  })
})
