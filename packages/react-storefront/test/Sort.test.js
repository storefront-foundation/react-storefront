/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import SubcategoryModelBase from '../src/model/SubcategoryModelBase'
import Sort from '../src/Sort'
import { Provider } from 'mobx-react'

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

describe('Sort', () => {

  it('renders with no sort selected', () => {
    expect(mount(
      <Provider router={{}}>
        <Sort model={createModel()}/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('renders with a sort selected', () => {
    expect(mount(
      <Provider router={{}}>
        <Sort model={createModel('price-asc')}/>
      </Provider>
    )).toMatchSnapshot()
  })

})