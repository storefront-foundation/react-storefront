import React from 'react'
import { act } from 'react-dom/test-utils'
import ReactVisibilitySensor from 'react-visibility-sensor'
import { mount } from 'enzyme'
import PWAContext from 'react-storefront/PWAContext'

describe('Lazy', () => {
  let wrapper, Lazy

  afterEach(() => {
    wrapper.unmount()
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => false,
      }))

      Lazy = require('react-storefront/Lazy').default
    })
  })

  it('should set children to visible when visibility sensor sends visible', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <Lazy>
          <div id="test">test</div>
        </Lazy>
      </PWAContext.Provider>,
      { attachTo: root },
    )

    expect(wrapper.find('#test').exists()).toBe(false)

    await act(async () => {
      await wrapper.find(ReactVisibilitySensor).prop('onChange')(true)
      await wrapper.update()
    })

    expect(wrapper.find('#test').text()).toBe('test')
  })

  it('should be visible from the start when ssrOnly is true', async () => {
    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(
      <PWAContext.Provider value={{ hydrating: false }}>
        <Lazy ssrOnly>
          <div id="test">test</div>
        </Lazy>
      </PWAContext.Provider>,
      { attachTo: root },
    )

    expect(wrapper.find('#test').text()).toBe('test')
  })
})
