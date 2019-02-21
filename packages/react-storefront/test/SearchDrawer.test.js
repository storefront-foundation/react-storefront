/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import SearchDrawer from '../src/SearchDrawer'
import { mount } from 'enzyme'
import Provider from './TestProvider'
import AppModelBase from '../src/model/AppModelBase'
import createTheme from '../src/createTheme'
import { MuiThemeProvider } from '@material-ui/core'

describe('SearchDrawer', () => {
  let TestContext, app

  beforeEach(() => {
    app = AppModelBase.create({ search: { show: true } })

    TestContext = ({ children }) => (
      <div id="root">
        <Provider app={app}>
          { children }
        </Provider>
      </div>
    )
  })

  it('should render with no props', () => {
    expect(mount(
      <TestContext>
        <SearchDrawer/>
      </TestContext>
    )).toMatchSnapshot()
  })

  it('should set input placeholder text when props.placeholder is set', () => {
    const wrapper = mount(
      <TestContext>
        <SearchDrawer placeholder="foo"/>
      </TestContext>
    )
    
    expect(wrapper.find('input').props().placeholder).toBe('foo')
  })

  it('should use a text button when closeButtonText is set', () => {
    const wrapper = mount(
      <TestContext>
        <SearchDrawer closeButtonText="foo"/>
      </TestContext>
    )
    
    expect(wrapper.find('button').first().text()).toBe('foo')
  })

  it('should blur the background by default', () => {
    app.search.toggle(false)
    document.body.classList.remove('moov-blur')

    mount(
      <TestContext>
        <SearchDrawer/>
      </TestContext>
    )

    app.search.toggle(true)
    
    expect(document.body.classList.contains('moov-blur')).toBe(true)
  })

  it('should not blur background when blurBackground={false}', () => {
    app.search.toggle(false)
    document.body.classList.remove('moov-blur')

    mount(
      <TestContext>
        <SearchDrawer blurBackground={false}/>
      </TestContext>
    )

    app.search.toggle(true)
    
    expect(document.body.classList.contains('moov-blur')).toBe(false)
  })

  describe('searchButtonVariant', () => {
    describe('fab', () => {
      it('should render the search button as a separate fab when text is entered', () => {
        const wrapper = mount(
          <TestContext>
            <SearchDrawer searchButtonVariant="fab"/>
          </TestContext>
        )
        wrapper.find('input').simulate('change', {target: {value: 'My new value'}})
        expect(wrapper.find({ rel: 'search' }).exists()).toBe(true)
        expect(wrapper.find({ rel: 'clear' }).exists()).toBe(true)
      })
    })
    describe('icon', () => {
      it('should not show the clear button when showClearButton is false and text is entered', () => {
        const wrapper = mount(
          <TestContext>
            <SearchDrawer showClearButton={false} searchButtonVariant="icon"/>
          </TestContext>
        )
        wrapper.find('input').simulate('change', {target: {value: 'My new value'}})
        expect(wrapper.find({ rel: 'clear' }).exists()).toBe(false)
      })
      it('should show the clear text is entered', () => {
        const wrapper = mount(
          <TestContext>
            <SearchDrawer searchButtonVariant="icon"/>
          </TestContext>
        )
        wrapper.find('input').simulate('change', {target: {value: 'My new value'}})
        expect(wrapper.find({ rel: 'clear' }).exists()).toBe(true)
        expect(wrapper.find({ rel: 'search' }).exists()).toBe(false)
      })
    })
  })
})
