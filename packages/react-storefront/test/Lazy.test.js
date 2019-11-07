import React from 'react'
import TestProvider from './TestProvider'
import { mount } from 'enzyme'

describe('Lazy', () => {
  let Lazy

  describe('server', () => {
    beforeEach(() => {
      jest.isolateModules(() => {
        jest.mock('../src/environment', () => ({
          isServer: () => true,
          isClient: () => false
        }))

        Lazy = require('../src/Lazy').default
      })
    })

    it('should be lazy when rendering PWA', () => {
      const wrapper = mount(
        <TestProvider>
          <Lazy>
            <div id="target">foo</div>
          </Lazy>
        </TestProvider>
      )

      expect(wrapper.exists('#target')).toBe(false)
    })

    it('should not be lazy when rendering AMP', () => {
      const wrapper = mount(
        <TestProvider app={{ amp: true }}>
          <Lazy>
            <div id="target">foo</div>
          </Lazy>
        </TestProvider>
      )

      expect(wrapper.exists('#target')).toBe(true)
    })

    it('should not be lazy on the server when server=false', () => {
      const wrapper = mount(
        <TestProvider>
          <Lazy server={false}>
            <div id="target">foo</div>
          </Lazy>
        </TestProvider>
      )

      expect(wrapper.exists('#target')).toBe(true)
    })
  })

  describe('client', () => {
    beforeEach(() => {
      jest.isolateModules(() => {
        jest.mock('../src/environment', () => ({
          isServer: () => false,
          isClient: () => true
        }))

        Lazy = require('../src/Lazy').default
      })
    })

    it('should be lazy on the client when server=false', () => {
      const wrapper = mount(
        <TestProvider>
          <Lazy server={false}>
            <div id="target">foo</div>
          </Lazy>
        </TestProvider>
      )

      expect(wrapper.exists('#target')).toBe(false)
    })
  })
})
