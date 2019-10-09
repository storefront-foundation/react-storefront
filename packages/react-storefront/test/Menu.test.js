/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import Menu from '../src/Menu'
import AppModelBase from '../src/model/AppModelBase'
import { mount } from 'enzyme'
import Provider from './TestProvider'
import ExpandIcon from '@material-ui/icons/Add'
import CollapseIcon from '@material-ui/icons/Remove'

describe('Menu', () => {
  let app

  beforeEach(() => {
    app = AppModelBase.create({
      location: {
        pathname: '/',
        search: '',
        hostname: 'localhost'
      },
      menu: {
        levels: [
          {
            root: true,
            items: [
              {
                text: 'Group 1',
                items: [
                  {
                    text: 'Item 1',
                    url: '/item1',
                    items: [{ text: 'Child 1', url: '/item1/child1' }]
                  }
                ]
              }
            ]
          }
        ]
      }
    })
  })

  it('should render in simple mode', () => {
    expect(
      mount(
        <Provider app={app} history={{}}>
          <Menu simple />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render in complex mode by default', () => {
    expect(
      mount(
        <Provider app={app} history={{}}>
          <Menu />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render in complex mode by default', () => {
    expect(
      mount(
        <Provider app={app} history={{}}>
          <Menu useexpanders />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should use custom icons', () => {
    expect(
      mount(
        <Provider app={app} history={{}}>
          <Menu useexpanders ExpandIcon={ExpandIcon} CollapseIcon={CollapseIcon} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render with expand first not root item by default', () => {
    const component = mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders expandFirstItem />
      </Provider>
    )

    const rootItem = component.find('ListItem').at(0)

    rootItem.simulate('click')
    component.update()

    expect(app.menu.levels[0].items[0].items[0].expanded).toBe(false)
  })

  it('should render without expand first not root item by default', () => {
    const component = mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders />
      </Provider>
    )

    const rootItem = component.find('ListItem').at(0)

    rootItem.simulate('click')
    component.update()

    expect(app.menu.levels[0].items[0].items[0].expanded).toBe(false)
    expect(component).toMatchSnapshot()
  })

  it('should be able to render leaf as a top level item', () => {
    let appWithTopLevelLeaf = AppModelBase.create({
      location: {
        pathname: '/',
        search: '',
        hostname: 'localhost'
      },
      menu: {
        levels: [
          {
            root: true,
            items: [
              {
                text: 'Group 1',
                items: [
                  {
                    text: 'Item 1',
                    url: '/item1',
                    items: [{ text: 'Child 1', url: '/item1/child1' }]
                  }
                ]
              },
              {
                text: 'Leaf',
                url: '/leaf'
              }
            ]
          }
        ]
      }
    })
    expect(
      mount(
        <Provider app={appWithTopLevelLeaf} history={{}}>
          <Menu simple />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  describe('custom renderers', () => {
    let appWithTopLevelLeaf

    beforeEach(() => {
      appWithTopLevelLeaf = AppModelBase.create({
        location: {
          pathname: '/',
          search: '',
          hostname: 'localhost'
        },
        menu: {
          levels: [
            {
              root: true,
              items: [
                {
                  text: 'Group 1',
                  items: [
                    {
                      text: 'Item 1',
                      url: '/item1',
                      items: [{ text: 'Child 1', url: '/item1/child1' }]
                    }
                  ]
                },
                {
                  text: 'Leaf',
                  url: '/leaf'
                }
              ]
            }
          ]
        }
      })
    })

    describe('itemRenderer', () => {
      it('should be called for each item', () => {
        const renderer = jest.fn(item => <div>{item.text}</div>)
        expect(
          mount(
            <Provider app={appWithTopLevelLeaf} history={{}}>
              <Menu simple itemRenderer={renderer} />
            </Provider>
          )
        ).toMatchSnapshot()
        expect(renderer.mock.calls[0][0].text).toEqual('Group 1')
        expect(renderer.mock.calls[1][0].text).toEqual('Leaf')
        expect(renderer.mock.calls).toHaveLength(2)
      })

      it('should render the default when null is returned', () => {
        const renderer = jest.fn()
        expect(
          mount(
            <Provider app={appWithTopLevelLeaf} history={{}}>
              <Menu simple itemRenderer={renderer} />
            </Provider>
          )
        ).toMatchSnapshot()
        expect(renderer.mock.calls).toHaveLength(4)
        expect(renderer.mock.calls[0][0].text).toEqual('Group 1')
        expect(renderer.mock.calls[1][0].text).toEqual('Item 1')
        expect(renderer.mock.calls[2][0].text).toEqual('Child 1')
        expect(renderer.mock.calls[3][0].text).toEqual('Leaf')
      })
    })

    describe('itemContentRenderer', () => {
      it('should be called for each item', () => {
        const renderer = jest.fn(item => <div>{item.text}</div>)

        expect(
          mount(
            <Provider app={appWithTopLevelLeaf} history={{}}>
              <Menu simple itemContentRenderer={renderer} />
            </Provider>
          )
        ).toMatchSnapshot()

        expect(renderer.mock.calls[0][0].text).toEqual('Group 1')
        expect(renderer.mock.calls[1][0].text).toEqual('Item 1')
        expect(renderer.mock.calls[2][0].text).toEqual('Child 1')
        expect(renderer.mock.calls[3][0].text).toEqual('Leaf')
        expect(renderer.mock.calls).toHaveLength(4)
      })
    })
  })

  describe('custom leaf renderers', () => {
    let app

    beforeEach(() => {
      app = AppModelBase.create({
        location: {
          pathname: '/',
          search: '',
          hostname: 'localhost'
        },
        menu: {
          level: 1,
          levels: [
            {
              root: true,
              items: [
                {
                  text: 'Group 1',
                  items: [
                    {
                      text: 'Item 1',
                      url: '/item1',
                      items: [{ text: 'Child 1', url: '/item1/child1' }]
                    }
                  ]
                },
                {
                  text: 'Leaf',
                  url: '/leaf'
                }
              ]
            },
            {
              text: 'Group 1',
              root: false,
              items: [
                {
                  text: 'Item 1',
                  url: '/item1',
                  items: [{ text: 'Child 1', url: '/item1/child1' }]
                }
              ]
            }
          ]
        }
      })
    })

    it('renderLeafHeader should be called and render the result', () => {
      const renderLeafHeader = jest.fn(({ list, goBack }) => {
        return <div id="header">{list.text}</div>
      })

      const wrapper = mount(
        <Provider app={app} history={{}}>
          <Menu renderLeafHeader={renderLeafHeader} />
        </Provider>
      )

      expect(renderLeafHeader).toHaveBeenCalledWith({
        list: app.menu.levels[1],
        goBack: expect.any(Function),
        backButtonAmpProps: expect.anything()
      })

      expect(
        wrapper
          .find('#header')
          .first()
          .text()
      ).toBe('Group 1')
    })

    it('renderLeafFooter should be called and render the result', () => {
      const renderLeafFooter = jest.fn(({ list }) => {
        return <div id="footer">{list.text}</div>
      })

      const wrapper = mount(
        <Provider app={app} history={{}}>
          <Menu renderLeafFooter={renderLeafFooter} />
        </Provider>
      )

      expect(renderLeafFooter).toHaveBeenCalledWith({
        list: app.menu.levels[1]
      })

      expect(
        wrapper
          .find('#footer')
          .first()
          .text()
      ).toBe('Group 1')
    })
  })

  it('should render children', () => {
    const wrapper = mount(
      <Provider app={app} history={{}}>
        <Menu>
          <div id="child">Test</div>
        </Menu>
      </Provider>
    )
    expect(wrapper.find('#child')).toHaveLength(1)
  })

  describe('MenuItem.className', () => {
    let app

    beforeEach(() => {
      app = AppModelBase.create({
        location: {
          pathname: '/',
          search: '',
          hostname: 'localhost'
        },
        menu: {
          levels: [
            {
              root: true,
              items: [
                {
                  text: 'Group 1',
                  className: 'group-1',
                  items: [
                    {
                      text: 'Item 1',
                      url: '/item1',
                      className: 'item-1',
                      items: [{ text: 'Child 1', url: '/item1/child1', className: 'child-1' }]
                    }
                  ]
                }
              ]
            }
          ]
        }
      })
    })

    it('should render item.className in regular mode', () => {
      const wrapper = mount(
        <Provider app={app} history={{}}>
          <Menu useExpanders />
        </Provider>
      )
      expect(wrapper.exists('.group-1')).toBe(true)
      wrapper.find('ListItem').simulate('click')
      wrapper.update()
      expect(wrapper.exists('.child-1')).toBe(true)
      expect(wrapper.exists('.item-1')).toBe(true)
    })

    it('should render item.className in simple mode', () => {
      const wrapper = mount(
        <Provider app={app} history={{}}>
          <Menu simple />
        </Provider>
      )
      expect(wrapper.exists('.group-1')).toBe(true)
      expect(wrapper.exists('.child-1')).toBe(true)
      expect(wrapper.exists('.item-1')).toBe(true)
    })
  })

  describe('lazyItemsURL', () => {
    it('should lazy load items when the node is clicked', () => {
      app = AppModelBase.create({
        location: {
          pathname: '/',
          search: '',
          hostname: 'localhost'
        },
        menu: {
          levels: [
            {
              root: true,
              items: [
                {
                  text: 'Group 1',
                  className: 'group-1',
                  lazyItemsURL: '/lazy/items.json'
                }
              ]
            }
          ]
        }
      })

      const wrapper = mount(
        <Provider app={app} history={{}}>
          <Menu simple />
        </Provider>
      )

      wrapper
        .find('.group-1')
        .at(0)
        .simulate('click')

      expect(global.fetch).toHaveBeenCalledWith('/lazy/items.json')
    })
  })
})
