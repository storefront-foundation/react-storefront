import React from 'react'
import { mount } from 'enzyme'

describe('CmsSlot', () => {
  let wrapper,
    CmsSlot,
    lazyLoadImages,
    prefetch,
    error = false

  afterEach(() => {
    wrapper.unmount()
    lazyLoadImages = undefined
    prefetch = undefined
    error = false
  })

  beforeAll(() => {
    jest.isolateModules(() => {
      jest.doMock('react-storefront/utils/lazyLoadImages', () =>
        jest.fn(x => {
          if (error) {
            throw new Error('test')
          }
          lazyLoadImages = true
          return 'done'
        }),
      )

      jest.doMock('react-storefront/serviceWorker', () => ({
        prefetchJsonFor: () => (prefetch = true),
      }))

      CmsSlot = require('react-storefront/CmsSlot').default
    })
  })

  afterAll(() => {
    jest.resetModules()
  })

  it('should be empty render without children', () => {
    wrapper = mount(<CmsSlot />)

    expect(wrapper.find(CmsSlot).isEmptyRender()).toBe(true)
  })

  it('should render children ', () => {
    wrapper = mount(<CmsSlot>test</CmsSlot>)

    expect(wrapper.find(CmsSlot).text()).toBe('test')
  })
  it('should apply styles on inline prop', () => {
    wrapper = mount(<CmsSlot inline>test</CmsSlot>)

    expect(wrapper.find('span').prop('className')).toContain('inline')
  })

  it('should lazyload images with lazyLoadImages prop', () => {
    wrapper = mount(<CmsSlot lazyLoadImages>test</CmsSlot>)

    expect(lazyLoadImages).toBe(true)
  })

  it('should prefetch links with prefetchLinks prop', async () => {
    wrapper = mount(
      <CmsSlot prefetchLinks>{'<a id="test" data-rsf-prefetch="always">test</a>'}</CmsSlot>,
    )

    expect(prefetch).toBe(true)
  })

  it('should catch errors while running effects', async () => {
    jest.spyOn(console, 'warn').mockImplementation(() => {})

    error = true
    wrapper = mount(<CmsSlot lazyLoadImages>test</CmsSlot>)

    expect(console.warn).toHaveBeenCalled()

    console.warn.mockRestore()
  })
})
