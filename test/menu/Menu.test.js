import React from 'react'
import { mount } from 'enzyme'
import Menu from 'react-storefront/menu/Menu'
import MenuBack from 'react-storefront/menu/MenuBack'
import MenuCard from 'react-storefront/menu/MenuCard'
import MenuFooter from 'react-storefront/menu/MenuFooter'
import MenuHeader from 'react-storefront/menu/MenuHeader'
import { ListItem } from '@material-ui/core'
import { ChevronLeft } from '@material-ui/icons'

describe('Menu', () => {
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

  it('should render footer', () => {
    wrapper = mount(
      <Menu
        root={{
          items: [{ text: 'item1', href: '/item1', as: '/item1', items: [] }],
          footer: 'hello',
        }}
      />,
    )
    expect(wrapper.find(MenuFooter).length).toBe(1)
  })

  it('should render header', () => {
    wrapper = mount(
      <Menu
        open
        root={{
          items: [{ text: 'item1', href: '/item1', as: '/item1', items: [] }],
          header: 'hello',
        }}
      />,
    )
    expect(wrapper.find(MenuHeader).length).toBe(1)
  })

  it('should navigate to submenu', () => {
    wrapper = mount(
      <Menu
        root={{
          items: [{ text: 'item1', href: '/item1', as: '/item1', items: [] }],
        }}
      />,
    )
    expect(
      wrapper
        .find(MenuCard)
        .first()
        .prop('card'),
    ).toBe(0)
    wrapper
      .find(ListItem)
      .first()
      .simulate('click')
    expect(
      wrapper
        .find(MenuCard)
        .first()
        .prop('card'),
    ).toBe(1)
    // Not sure this is actually possible for a user to do, since
    // they are clicking a hidden menu item
    wrapper
      .find(ListItem)
      .first()
      .simulate('click')
  })

  it('should render with persistence', () => {
    wrapper = mount(
      <Menu
        persistent
        root={{
          items: [
            { text: 'item1', href: '/item1', as: '/item1', items: [] },
            { text: 'item2', href: '/item2', as: '/item2' },
            { text: 'item3', href: '/item3', as: '/item3', state: { foo: 'bar' } },
          ],
        }}
      />,
    )
    expect(wrapper.find(ListItem).length).toBe(3)
  })

  it('should use menu back to come back from submenu', () => {
    wrapper = mount(
      <Menu
        persistent
        root={{
          items: [{ text: 'item1', href: '/item1', as: '/item1', items: [] }],
        }}
      />,
    )
    expect(
      wrapper
        .find(MenuCard)
        .first()
        .prop('card'),
    ).toBe(0)
    wrapper
      .find(ListItem)
      .first()
      .simulate('click')
    expect(
      wrapper
        .find(MenuCard)
        .first()
        .prop('card'),
    ).toBe(1)
    wrapper
      .find(MenuBack)
      .first()
      .simulate('click')
    expect(
      wrapper
        .find(MenuCard)
        .first()
        .prop('card'),
    ).toBe(0)
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
    expect(wrapper.find(ListItem).text()).toBe('bar')
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
      .find(ListItem)
      .at(0)
      .simulate('click')
    expect(wrapper.find(ChevronLeft).length).toBe(1)
  })
})
