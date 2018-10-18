/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import Menu from '../src/Menu'
import AppModelBase from '../src/model/AppModelBase'
import { mount } from 'enzyme'
import { Provider } from 'mobx-react'
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
        levels: [{
          root: true,
          items: [{
            text: "Group 1",
            items: [
              { text: 'Item 1', url: '/item1', items: [
                { text: 'Child 1', url: '/item1/child1' }
              ]}
            ]
          }]
        }]
      }
    })
  })

  it('should render in simple mode', () => {
    expect(mount(
      <Provider app={app} history={{}}>
        <Menu simple/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should render in complex mode by default', () => {
    expect(mount(
      <Provider app={app} history={{}}>
        <Menu/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should render in complex mode by default', () => {
    expect(mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should use custom icons', () => {
    expect(mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders ExpandIcon={ExpandIcon} CollapseIcon={CollapseIcon}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should render with expand first not root item by default', () => {
    const component = mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders expandFirstItem />
      </Provider>
    )
    const rootItem = component.find('ul').at(0).find('li').at(0)

    rootItem.simulate('click')
    component.update()

    const expandableItem = component.find('ul').at(1).find('li').at(1)
    
    expect(expandableItem.html()).toMatch(/RSFMenu-expanded-/)
  })

  it('should render without expand first not root item by default', () => {
    const component = mount(
      <Provider app={app} history={{}}>
        <Menu useexpanders />
      </Provider>
    )
    const rootItem = component.find('ul').at(0).find('li').at(0)

    rootItem.simulate('click')
    component.update()

    const expandableItem = component.find('ul').at(1).find('li').at(1)
    expect(expandableItem.hasClass('RSFMenu-expanded-13')).toEqual(false)

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
        levels: [{
          root: true,
          items: [{
            text: "Group 1",
            items: [
              { text: 'Item 1', url: '/item1', items: [
                { text: 'Child 1', url: '/item1/child1' }
              ]}
            ]
          }, {
            text: 'Leaf',
            url: '/leaf'
          }]
        }]
      }
    })
    expect(mount(
      <Provider app={appWithTopLevelLeaf} history={{}}>
        <Menu simple />
      </Provider>
    )).toMatchSnapshot()
  })

})