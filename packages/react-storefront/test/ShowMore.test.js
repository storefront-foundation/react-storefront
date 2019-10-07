/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import ShowMore from '../src/ShowMore'
import SubcategoryModelBase from '../src/model/SubcategoryModelBase'
import { mount } from 'enzyme'
import Provider from './TestProvider'

function createModel(values = {}) {
  return SubcategoryModelBase.create({
    id: '1',
    page: 0,
    items: [{ id: '1' }, { id: '2' }],
    total: 10,
    ...values
  })
}

describe('ShowMore', () => {
  it('should render', () => {
    expect(
      mount(
        <Provider>
          <ShowMore model={createModel()} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render a link for amp', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <ShowMore model={createModel()} />
      </Provider>
    )

    expect(wrapper.find('a').prop('href')).toBe('/?page=1#item-10')
  })

  it('should accept a pageSize', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <ShowMore model={createModel({ pageSize: 20 })} />
      </Provider>
    )

    expect(wrapper.find('a').prop('href')).toBe('/?page=1#item-20')
  })

  it('should show loading when loadingMore is true', () => {
    expect(
      mount(
        <Provider>
          <ShowMore model={createModel({ loadingMore: true })} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should hide when the number of items is equal to the total', () => {
    expect(
      mount(
        <Provider>
          <ShowMore model={createModel({ total: 1 })} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should hide when the page is equal to the numberOfPages - 1', () => {
    expect(
      mount(
        <Provider>
          <ShowMore model={createModel({ numberOfPages: 1, total: null })} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should show the loading spinner even when there are no more records', () => {
    expect(
      mount(
        <Provider>
          <ShowMore model={createModel({ loadingMore: true, numberOfPages: 1, total: null })} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render show more link in AMP mode even when infinite scroll is active', () => {
    const wrapper = mount(
      <Provider app={{ amp: true }}>
        <ShowMore infiniteScroll model={createModel({ pageSize: 20 })} />
      </Provider>
    )
    expect(wrapper.find('a').prop('href')).toBe('/?page=1#item-20')
  })
})
