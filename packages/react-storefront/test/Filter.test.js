/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import SubcategoryModelBase from '../src/model/SubcategoryModelBase'
import Filter from '../src/Filter'
import Provider from './TestProvider'
import { mount } from 'enzyme'

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

describe('Filter', () => {

  it('renders with no filters selected', () => {
    const component = (
      <Provider router={{}} app={{}}>
        <Filter model={createModel([])}/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

  it('renders with filters selected', () => {
    const component = (
      <Provider router={{}} app={{}}>
        <Filter model={createModel(['0-100', 'sunburst'])}/>
      </Provider>
    )

    expect(mount(component)).toMatchSnapshot()
  })

})