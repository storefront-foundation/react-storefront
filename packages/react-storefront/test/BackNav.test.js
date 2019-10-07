/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import TestProvider from './TestProvider'
import { createMemoryHistory } from 'history'
import BackNav from '../src/BackNav'
import AppModelBase from '../src/model/AppModelBase'
import SearchResultsModelBase, {
  LAYOUT_LIST,
  LAYOUT_GRID
} from '../src/model/SearchResultsModelBase'

describe('BackNav', () => {
  let app, history

  beforeEach(() => {
    app = AppModelBase.create({})
    history = createMemoryHistory({
      initialEntries: ['/c/2']
    })
  })

  it('renders', () => {
    expect(
      mount(
        <TestProvider history={history} app={app}>
          <BackNav text="Rugs" url="/s/1" />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('renders the view type switcher', () => {
    const searchResults = SearchResultsModelBase.create({ id: '1' })

    expect(
      mount(
        <TestProvider history={history}>
          <BackNav text="Furniture" url="/c/1" searchResults={searchResults} />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('render the corresponding tag if `labelComponent` prop provided', () => {
    expect(
      mount(
        <TestProvider history={history}>
          <BackNav text="Rugs" url="/rugs/1" labelComponent="h1" />
        </TestProvider>
      )
    ).toMatchSnapshot()
  })

  it('goes to the specified url when clicked', () => {
    const wrapper = mount(
      <TestProvider history={history}>
        <BackNav text="Rugs" url="/c/1" />
      </TestProvider>
    )

    wrapper
      .find('span[onClick]')
      .at(0)
      .simulate('click')
    expect(history.location.pathname).toBe('/c/1')
  })

  it('goes back in history when no url is provided', () => {
    const wrapper = mount(
      <TestProvider history={history}>
        <BackNav text="Back" />
      </TestProvider>
    )

    wrapper
      .find('span[onClick]')
      .at(0)
      .simulate('click')
    expect(history.location.pathname).toBe('/c/2')
  })

  it('switches the view types to grid when clicked', () => {
    const searchResults = SearchResultsModelBase.create({ id: '1', layout: LAYOUT_LIST })

    const wrapper = mount(
      <TestProvider history={history}>
        <BackNav text="Back" searchResults={searchResults} />
      </TestProvider>
    )

    wrapper
      .find('BorderAllIcon[onClick]')
      .at(0)
      .simulate('click')
    expect(searchResults.layout).toBe(LAYOUT_GRID)
  })

  it('switches the view types to list when clicked', () => {
    const searchResults = SearchResultsModelBase.create({ id: '1', layout: LAYOUT_GRID })

    const wrapper = mount(
      <TestProvider history={history}>
        <BackNav text="Back" searchResults={searchResults} />
      </TestProvider>
    )

    wrapper
      .find('ViewAgendaIcon[onClick] svg')
      .at(0)
      .simulate('click')
    expect(searchResults.layout).toBe(LAYOUT_LIST)
  })
})
