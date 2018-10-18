/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import Image from '../src/Image'
import { Provider } from 'mobx-react'
import AppModelBase from '../src/model/AppModelBase'

describe("Image", () => {
  it('should render', () => {
    expect(mount(
      <Provider app={AppModelBase.create({ amp: false })}>
        <Image src="/foo.png"/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should use amp-img when rendering with amp: true', () => {
    expect(mount(
      <Provider app={AppModelBase.create({ amp: true })}>
        <Image src="/foo.png"/>
      </Provider>
    )).toMatchSnapshot()
  })

  it('should use height and width for amp-img when provided', () => {
    const wrapper = mount(
      <Provider app={AppModelBase.create({ amp: true })}>
        <Image src="/foo.png" height={50} width={100}/>
      </Provider>
    )

    const ampImg = wrapper.find('amp-img')
    expect(ampImg.prop('height')).toBe(50)
    expect(ampImg.prop('width')).toBe(100)
    expect(ampImg.prop('layout')).toBe('intrinsic')
  })

  it('should use layout=fill for amp-img when aspectRatio is provided', () => {
    const wrapper = mount(
      <Provider app={AppModelBase.create({ amp: true })}>
        <Image src="/foo.png" aspectRatio={50}/>
      </Provider>
    )

    const ampImg = wrapper.find('amp-img')
    expect(ampImg.prop('layout')).toBe("fill")
  })

  it('should lazy load the image when lazy==true', () => {
    const wrapper = mount(
      <Provider app={AppModelBase.create({ amp: false })}>
        <Image lazy src="/foo.png" aspectRatio={50}/>
      </Provider>
    )

    expect(wrapper).toMatchSnapshot()
  })
})