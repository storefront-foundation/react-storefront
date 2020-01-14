import React from 'react'
import { mount } from 'enzyme'
import { Router, goBack, navigate } from '../mocks/mockRouter'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'

describe('useNavigationEvent', () => {
  let Test, wrapper, cb

  beforeEach(() => {
    cb = jest.fn()
    Test = () => {
      useNavigationEvent(cb)
      return null
    }
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should be called after navigation', () => {
    wrapper = mount(<Test />)
    navigate('/foo')
    expect(cb).toHaveBeenCalled()
  })
})
