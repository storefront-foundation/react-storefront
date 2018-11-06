/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { ImageSwitcher } from '../src/Skeleton'
import AppModelBase from '../src/model/AppModelBase'
import { mount } from 'enzyme'
import Provider from './TestProvider'

describe('Skeleton', () => {
  describe('ImageSwitcher', () => {
    let app

    beforeEach(() => {
      app = AppModelBase.create({
        product: {
          id: "1",
          name: "Foo"
        },
        productThumbnail: '/foo/bar.png'
      })
    })

    it('should include thumbnails by default', () => {
      expect(
        mount(
          <Provider app={app}>
            <ImageSwitcher/>
          </Provider>
        )
      ).toMatchSnapshot()
    })

    it('should include hide thumbnails when thumbnails=false', () => {
      expect(
        mount(
          <Provider app={app}>
            <ImageSwitcher thumbnails={false}/>
          </Provider>
        )
      ).toMatchSnapshot()
    })
  })
})