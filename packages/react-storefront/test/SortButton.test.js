/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import SubcategoryModelBase from '../src/model/SubcategoryModelBase'
import SortButton from '../src/SortButton'
import Provider from './TestProvider'

function createModel(sort) {
  return SubcategoryModelBase.create({
    id: '1',
    sort,
    sortOptions: [
      { name: 'Price - Low to High', code: 'price-asc' },
      { name: 'Price - High to Low', code: 'price-desc' },
    ]
  })
}

describe('SortButton', () => {

  it('renders with no sort selected', () => {
    expect(mount(
      <Provider>
        <SortButton model={createModel()}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders with a sort selected', () => {
    expect(mount(
      <Provider>
        <SortButton model={createModel('price-asc')}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('uses the title prop as the label and drawer header', () => {
    expect(mount(
      <Provider>
        <SortButton title="Sort By" model={createModel('price-asc')}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('passes drawerProps to the underlying Sort component', () => {
    expect(mount(
      <Provider>
        <SortButton title="Sort By" model={createModel('price-asc')} drawerProps={{ queryParam: 'soryBy' }}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders a link when in amp mode', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <SortButton title="Sort By" model={createModel('price-asc')}/>
      </Provider>
    )
    expect(wrapper.find('a').prop('href')).toBe('/?openSort')
  })
})