import React, { useContext, useState, useRef } from 'react'
import { mount } from 'enzyme'
import PWAContext from 'react-storefront/PWAContext'
import ForwardThumbnail from 'react-storefront/ForwardThumbnail'

describe('ForwardThumbnail', () => {
  let wrapper, thumbnail

  afterEach(() => {
    wrapper.unmount()
  })

  const Test = () => {
    thumbnail = useRef(null)

    return (
      <PWAContext.Provider value={{ thumbnail }}>
        <ForwardThumbnail>
          <div id="test1">test1</div>
          <img id="test2" src="test2" />
        </ForwardThumbnail>
      </PWAContext.Provider>
    )
  }

  it('should render children', () => {
    wrapper = mount(<Test />)

    expect(wrapper.find('#test1').text()).toBe('test1')
    expect(wrapper.find('#test2').prop('src')).toBe('test2')
  })

  it('should set context thumbnail onClick', async () => {
    wrapper = mount(<Test />)

    expect(thumbnail).toStrictEqual({ current: null })

    wrapper.find(ForwardThumbnail).simulate('click')

    expect(thumbnail).toStrictEqual({ current: { src: 'test2' } })
  })
})
