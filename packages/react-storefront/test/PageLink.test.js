import React from 'react'
import ProductModelBase from '../src/model/ProductModelBase'
import { mount } from 'enzyme'
import PageLink from '../src/PageLink'
import TestProvider from './TestProvider'
import AppModelBase from '../src/model/AppModelBase'
import { createMemoryHistory } from 'history'

describe('PageLink', () => {
  describe('state', () => {
    let model, app, history

    beforeEach(() => {
      history = createMemoryHistory()
      history.push = jest.fn()
      model = ProductModelBase.create({
        id: '1',
        name: 'Test Product',
        url: '/p/1'
      })
      app = AppModelBase.create()
    })

    it('should be merged with model state', () => {
      const breadcrumbs = [{ text: 'Root', url: '/' }]

      const wrapper = mount(
        <TestProvider app={app} history={history}>
          <PageLink model={model} state={{ breadcrumbs }}>
            {model.name}
          </PageLink>
        </TestProvider>
      )

      wrapper
        .find('PageLink')
        .at(0)
        .simulate('click')

      expect(history.push.mock.calls[0][1].breadcrumbs).toEqual(breadcrumbs)
    })

    it('should accept a function', () => {
      const breadcrumbs = [{ text: 'Root', url: '/' }]
      const state = () => ({ breadcrumbs })

      const wrapper = mount(
        <TestProvider app={app} history={history}>
          <PageLink model={model} state={state}>
            {model.name}
          </PageLink>
        </TestProvider>
      )

      wrapper
        .find('PageLink')
        .at(0)
        .simulate('click')

      expect(history.push.mock.calls[0][1].breadcrumbs).toEqual(breadcrumbs)
    })
  })
})
