import React from 'react'
import { mount } from 'enzyme'
import LazyHydrate, { LazyStyles, getRegistryCount } from 'react-storefront/LazyHydrate'

describe('LazyHydrate', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should clear registries', () => {
    const hydrate = mount(
      <LazyHydrate id="test">
        <button>click</button>
      </LazyHydrate>,
    )
    expect(getRegistryCount()).toBe(1)
    wrapper = mount(
      <div>
        <LazyStyles />
      </div>,
    )
    expect(getRegistryCount()).toBe(0)
    hydrate.unmount()
  })

  it('should pass event through when hydrated', () => {
    const click = jest.fn()
    wrapper = mount(
      <LazyHydrate id="test" hydrated>
        <button onClick={click}>click</button>
      </LazyHydrate>,
    )
    wrapper.find('button').simulate('click')
    expect(click).toHaveBeenCalled()
  })

  it('should render children during SSR only mode', () => {
    const click = jest.fn()
    process.env.IS_BROWSER = 'false'
    wrapper = mount(
      <LazyHydrate id="test" ssrOnly>
        <button onClick={click}>click</button>
      </LazyHydrate>,
    )
    expect(wrapper.html()).toContain('<button>click</button>')
  })

  it('should not render children in the browser during SSR only mode', () => {
    const click = jest.fn()
    process.env.IS_BROWSER = 'true'
    wrapper = mount(
      <LazyHydrate id="test" ssrOnly>
        <button onClick={click}>click</button>
      </LazyHydrate>,
    )
    expect(wrapper.find('button').length).toBe(0)
  })

  it('should hydrate in browser once triggered', () => {
    process.env.IS_BROWSER = 'true'
    wrapper = mount(
      <LazyHydrate id="test" hydrated={false}>
        <button>click</button>
      </LazyHydrate>,
    )
    expect(wrapper.html()).not.toContain('<button>click</button>')
    wrapper.setProps({ hydrated: true })
    expect(wrapper.html()).toContain('<button>click</button>')
  })
})
