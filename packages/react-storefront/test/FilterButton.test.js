/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import CmsSlot from '../src/CmsSlot'
import SubcategoryModelBase from '../src/model/SubcategoryModelBase'
import FilterButton from '../src/FilterButton'
import Provider from './TestProvider'

function createModel(filters) {
  return SubcategoryModelBase.create({
    id: '1',
    filters,
    facetGroups: [{
      name: 'Price',
      facets: [{
        code: '0-100',
        name: 'Up to $100',
        matches: 20
      }, {
        code: '100-200',
        name: '$100 - $200',
        matches: 10
      }]
    }, {
      name: 'Color',
      facets: [{
        code: 'red',
        name: 'Red',
        matches: 2
      }, {
        code: 'sunburst',
        name: 'Sunburst',
        matches: 10
      }]
    }]
  })
}

describe('FilterButton', () => {

  it('renders with no filters selected', () => {
    expect(
      mount(
        <Provider>
          <FilterButton model={createModel([])} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('renders with filters selected', () => {
    expect(
      mount(
        <Provider>
          <FilterButton model={createModel(['0-100', 'sunburst'])} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('uses the title prop as the label and drawer header', () => {
    expect(mount(
      <Provider>
        <FilterButton title="Filter By" model={createModel([])}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('passes drawerProps onto the underlying Filter', () => {
    expect(mount(
      <Provider>
        <FilterButton title="Filter By" model={createModel([])} drawerProps={{ classes: { foo: 'bar' }}}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders a link when in amp mode', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <FilterButton title="Filter By" model={createModel([])} drawerProps={{ classes: { foo: 'bar' }}}/>
      </Provider>
    )
    expect(wrapper.find('a').prop('href')).toBe('/?openFilter')
  })

  it('should display a clear button when one or more filters is selected', () => {
    const wrapper = mount(
      <Provider>
        <FilterButton model={createModel(['0-100', 'sunburst'])} />
      </Provider>
    )
    expect(wrapper.find('button[className*="clear"]').text()).toBe('clear all')
  })

  it('should hide the clear button when hideClearLink=true', () => {
    const wrapper = mount(
      <Provider>
        <FilterButton hideClearLink  model={createModel(['0-100', 'sunburst'])} />
      </Provider>
    )
    expect(wrapper.find('button[className*="clear"]').length).toBe(0)
  })

  it('should allow you to change the text of the clear button', () => {
    const wrapper = mount(
      <Provider>
        <FilterButton clearLinkText="Clear Filters" model={createModel(['0-100', 'sunburst'])} />
      </Provider>
    )
    expect(wrapper.find('button[className*="clear"]').text()).toBe("Clear Filters")
  })
})