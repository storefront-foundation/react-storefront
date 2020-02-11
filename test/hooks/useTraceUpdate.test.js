import React from 'react'
import { mount } from 'enzyme'

describe('useTraceUpdate', () => {
  let useTraceUpdate, oldEnv

  describe('development', () => {
    beforeAll(() => {
      jest.isolateModules(() => {
        useTraceUpdate = require('react-storefront/hooks/useTraceUpdate').default
      })
    })

    afterAll(() => {
      global.useTraceUpdate = undefined
    })

    it('should print the props that changed', () => {
      const Test = props => {
        useTraceUpdate(props)
        return null
      }
      const log = jest.spyOn(console, 'log').mockImplementation()
      const wrapper = mount(<Test value={1} />)
      wrapper.setProps({ value: 1 })
      expect(log).toHaveBeenCalledWith('nothing changed')
      wrapper.setProps({ value: 2 })
      expect(log).toHaveBeenCalledWith('Changed props:', { value: [1, 2] })
      expect(global.useTraceUpdate).not.toBe(undefined)
    })
  })

  describe('production', () => {
    beforeAll(() => {
      oldEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'

      jest.isolateModules(() => {
        useTraceUpdate = require('react-storefront/hooks/useTraceUpdate').default
      })
    })

    afterAll(() => {
      process.env.NODE_ENV = oldEnv
    })

    it('should not have useTraceUpdate globally', () => {
      expect(global.useTraceUpdate).toBe(undefined)
    })
  })
})
