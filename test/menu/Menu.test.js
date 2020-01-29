import React from 'react'
import { mount } from 'enzyme'
import Menu from 'react-storefront/menu/Menu'

describe('Fill', () => {
  let wrapper

  afterEach(() => {
    if (wrapper.exists()) {
      wrapper.unmount()
    }
  })

  it('should render custom drawer', () => {
    wrapper = mount(<Menu renderDrawer={() => <div className="foo" />} />)
    expect(wrapper.find('.foo').length).toBe(1)
  })

  it('should render links within menu model', () => {
    wrapper = mount(<Menu root={{ items: [{ text: 'foo', href: '/foo', as: '/foo' }] }} />)
    expect(
      wrapper
        .find('a')
        .at(1)
        .prop('href'),
    ).toBe('/foo')
  })

  it('should render link within expanded menu', () => {
    wrapper = mount(
      <Menu
        root={{
          text: 'foo',
          items: [
            {
              text: 'foo',
              href: '/foo',
              as: '/foo',
              expanded: true,
              items: [{ text: 'bar', href: '/bar', as: '/bar' }],
            },
          ],
        }}
      />,
    )
    expect(wrapper.find('.MuiExpansionPanelDetails-root a .MuiListItemText-root').text()).toBe(
      'bar',
    )
  })

  it('should render back icon with in secondary menu', () => {
    wrapper = mount(
      <Menu
        open
        root={{
          text: 'foo',
          items: [
            {
              text: 'foo',
              href: '/foo',
              as: '/foo',
              items: [
                {
                  text: 'bar',
                  href: '/bar',
                  as: '/bar',
                  items: [
                    {
                      text: 'foo3',
                      href: '/foo3',
                      as: '/foo3',
                    },
                  ],
                },
              ],
            },
          ],
        }}
      />,
    )
    wrapper
      .find('.MuiListItem-root')
      .at(0)
      .simulate('click')
    expect(wrapper.find('.MuiSvgIcon-root').length).toBeGreaterThan(1)
  })
})
