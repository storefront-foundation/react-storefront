import React, { useState } from 'react'
import { mount } from 'enzyme'
import { act } from 'react-dom/test-utils'
import ReactVisibilitySensor from 'react-visibility-sensor'
import PWAContext from 'react-storefront/PWAContext'

describe('Image', () => {
  let wrapper,
    Image,
    src = 'test.com',
    notFoundSrc,
    aspectRatio,
    quality = null,
    contain = false,
    fill = false,
    lazy = false,
    lazyOffset = 100,
    optimize = {},
    spreadprops

  const clearValues = () => {
    wrapper.unmount()
    src = 'test.com'
    notFoundSrc = undefined
    aspectRatio = undefined
    quality = null
    contain = false
    fill = false
    lazy = false
    lazyOffset = 100
    optimize = {}
    spreadprops = undefined
  }

  afterEach(() => {
    clearValues()
  })

  beforeEach(() => {
    jest.isolateModules(() => {
      jest.mock('next/amp', () => ({
        useAmp: () => false,
      }))

      Image = require('react-storefront/Image').default
    })
  })

  afterAll(() => {
    jest.resetModules()
  })

  const Test = () => {
    return (
      <PWAContext.Provider value={{ hydrating: false }}>
        <Image
          src={src}
          notFoundSrc={notFoundSrc}
          aspectRatio={aspectRatio}
          quality={quality}
          contain={contain}
          fill={fill}
          lazy={lazy}
          lazyOffset={lazyOffset}
          optimize={optimize}
          spreadprops={spreadprops}
        />
      </PWAContext.Provider>
    )
  }

  it('should return empty render when src not provided', () => {
    src = undefined
    wrapper = mount(<Test />)

    expect(wrapper.find(Image).isEmptyRender()).toBe(true)
  })

  it('should spread props to img', () => {
    spreadprops = { test: 'test' }
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('spreadprops')).toBe(spreadprops)
  })

  it('should lazy load image when lazy prop is provided', async () => {
    lazy = true
    wrapper = mount(<Test />)

    expect(wrapper.find('img').exists()).toBe(false)

    await act(async () => {
      await wrapper.find(ReactVisibilitySensor).prop('onChange')(true)
      await wrapper.update()
    })

    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should not lazy load image when lazy prop is ssr', async () => {
    lazy = true
    wrapper = mount(<Image lazy="ssr" src="test.com" />)

    expect(wrapper.find('img').exists()).toBe(true)
  })

  it('should use fallback img when main image fails and notFoundSrc prop is provided', async () => {
    notFoundSrc = 'notfound.com'
    wrapper = mount(<Test />)

    await act(async () => {
      await wrapper.find('img').prop('onError')()
      await wrapper.update()
    })

    expect(wrapper.find('img').prop('src')).toBe(notFoundSrc)
  })

  it('should use fallback img when main image is loaded, natural width is 0 and notFoundSrc prop is provided', async () => {
    notFoundSrc = 'notfound.com'
    const spy = jest
      .spyOn(HTMLImageElement.prototype, 'complete', 'get')
      .mockImplementation(() => true)

    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('src')).toBe(notFoundSrc)
    spy.mockRestore()
  })

  it('should have right styles when contain prop is provided', async () => {
    contain = true
    wrapper = mount(<Test />)

    expect(
      wrapper
        .find('img')
        .parent()
        .prop('className'),
    ).toContain('contain')
  })

  it('should have right styles when fill prop is provided', async () => {
    fill = true
    wrapper = mount(<Test />)

    expect(
      wrapper
        .find('img')
        .parent()
        .prop('className'),
    ).toContain('fill')
  })

  it('should have right styles when aspectRatio prop is provided', async () => {
    aspectRatio = 0.5
    wrapper = mount(<Test />)

    expect(wrapper.find('img').prop('className')).toContain('fit')
    expect(
      wrapper
        .find('div')
        .filterWhere(n => n.prop('style'))
        .first()
        .prop('style').paddingTop,
    ).toBe('50%')
  })
})
