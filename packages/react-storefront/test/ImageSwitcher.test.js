/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import { mount } from 'enzyme'
import ImageSwitcher from '../src/ImageSwitcher'
import Provider from './TestProvider'
import AppModelBase from '../src/model/AppModelBase'
import AmpState from '../src/amp/AmpState'
import TestProvider from './TestProvider'
import ProductModelBase from '../src/model/ProductModelBase'
import { act } from 'react-dom/test-utils'

describe('ImageSwitcher', () => {
  it('only shows images by default, no bells and whistles', () => {
    expect(
      mount(
        <Provider>
          <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render thumbnails', () => {
    expect(
      mount(
        <Provider>
          <ImageSwitcher
            images={['/a.jpg', '/b.jpg', '/c.jpg']}
            thumbnails={['/at.jpg', '/bt.jpg', '/ct.jpg']}
          />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render arrows', () => {
    expect(
      mount(
        <Provider>
          <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} arrows />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render indicator dots', () => {
    expect(
      mount(
        <Provider>
          <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} showIndicators />
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render AmpImageSwitcher when amp=true', () => {
    let app, history

    expect(
      mount(
        <Provider
          app={AppModelBase.create({
            amp: true,
            location: { pathname: '', search: '' },
            product: { id: '', color: { options: [{ id: 'foo' }] } }
          })}
          nextId={() => '1'}
        >
          <AmpState>
            <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} />
          </AmpState>
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should render AmpImageSwitcher without product colors', () => {
    let app, history

    expect(
      mount(
        <Provider
          app={AppModelBase.create({
            amp: true,
            location: { pathname: '', search: '' },
            product: { id: '' }
          })}
          nextId={() => '1'}
        >
          <AmpState>
            <ImageSwitcher images={['/a.jpg', '/b.jpg', '/c.jpg']} />
          </AmpState>
        </Provider>
      )
    ).toMatchSnapshot()
  })

  it('should accept image objects and use given props', () => {
    const wrapper = mount(
      <Provider>
        <ImageSwitcher images={[{ src: 'test.jpg', alt: 'test' }]} />
      </Provider>
    )
    expect(
      wrapper
        .find('img')
        .first()
        .prop('alt')
    ).toBe('test')
  })

  it('should reset the image when the product changes', () => {
    function Test({ product }) {
      return (
        <TestProvider>
          <ImageSwitcher product={product} />
        </TestProvider>
      )
    }

    const wrapper = mount(
      <Test
        product={{
          id: '1',
          images: [
            'http://localhost/1/1.png',
            'http://localhost/1/2.png',
            'http://localhost/1/3.png'
          ]
        }}
      />
    )

    wrapper
      .find('ChevronRightIcon')
      .at(0)
      .simulate('click')

    wrapper.setProps({
      product: {
        id: '2',
        images: ['http://localhost/2/1.png', 'http://localhost/2/2.png', 'http://localhost/2/3.png']
      }
    })

    expect(wrapper.find('ReactSwipableView').prop('index')).toBe(0)
  })

  it('should show the first image when images change', () => {
    function Test({ product }) {
      return (
        <TestProvider>
          <ImageSwitcher product={product} resetSelectionWhenImagesChange thumbnails />
        </TestProvider>
      )
    }

    const product = ProductModelBase.create({
      id: '1',
      images: ['http://localhost/1/1.png', 'http://localhost/1/2.png', 'http://localhost/1/3.png']
    })

    const wrapper = mount(<Test product={product} />)

    wrapper
      .find('ChevronRightIcon')
      .at(0)
      .simulate('click')

    expect(wrapper.find('ReactSwipableView').prop('index')).toBe(1)

    wrapper.setProps({
      product: {
        id: '1',
        images: ['http://localhost/2/1.png', 'http://localhost/2/2.png', 'http://localhost/2/3.png']
      }
    })

    expect(wrapper.find('ReactSwipableView').prop('index')).toBe(0)
  })

  it('accepts imageProps', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          images={[{ src: 'test.jpg', alt: 'test' }]}
          selectedIndex={0}
          imageProps={{ quality: 50 }}
        />
      </TestProvider>
    )
    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('src')
    ).toMatch(/opt\.moovweb/)
  })

  it('uses the product name as the alt prop when no alt is provided', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          product={{ name: 'Red Shirt' }}
          images={[{ src: 'test.jpg' }, { src: 'with_alt.jpg' }]}
          selectedIndex={0}
        />
      </TestProvider>
    )

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('Red Shirt')
  })

  it('uses the alt that is provided', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          product={{ name: 'Red Shirt' }}
          images={[{ src: 'test.jpg', alt: 'a red shirt' }]}
        />
      </TestProvider>
    )

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('a red shirt')
  })

  it('uses the alt that is provided on the product', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          product={{ name: 'Red Shirt', images: [{ src: 'test.jpg', alt: 'a red shirt' }] }}
        />
      </TestProvider>
    )

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('a red shirt')
  })

  it('uses the product name as the alt prop when only urls are provided', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher product={{ name: 'Red Shirt' }} images={['test.jpg']} selectedIndex={0} />
      </TestProvider>
    )

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('Red Shirt')
  })

  it('uses the product name as the alt prop when only urls are provided on the product', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher product={{ name: 'Red Shirt', images: ['test.jpg'] }} />
      </TestProvider>
    )

    expect(
      wrapper
        .find('img')
        .at(0)
        .prop('alt')
    ).toEqual('Red Shirt')
  })

  it('uses the provided alts for thumbnails', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          product={{ name: 'Red Shirt' }}
          images={['test.jpg']}
          thumbnails={[{ src: 'thumb.jpg', alt: 'red shirt thumbnail' }]}
        />
      </TestProvider>
    )

    expect(
      wrapper
        .find('Image[src="thumb.jpg"]')
        .at(0)
        .prop('alt')
    ).toEqual('red shirt thumbnail')
  })

  it('uses the provided alts for thumbnails from the product', () => {
    const wrapper = mount(
      <TestProvider>
        <ImageSwitcher
          product={{
            name: 'Red Shirt',
            images: ['test.jpg'],
            thumbnails: [{ src: 'thumb.jpg', alt: 'red shirt thumbnail' }]
          }}
        />
      </TestProvider>
    )

    expect(
      wrapper
        .find('Image[src="thumb.jpg"]')
        .at(0)
        .prop('alt')
    ).toEqual('red shirt thumbnail')
  })
})
