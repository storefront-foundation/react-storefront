import React from 'react'
import { mount } from 'enzyme'
import Media from 'react-storefront/carousel/Media'
import ReactImageMagnify from 'react-image-magnify'
import Image from 'react-storefront/Image'

describe('Media', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => null)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should render video component if type is video', () => {
    wrapper = mount(<Media type="video" />)

    expect(wrapper.find('video')).toExist()
  })

  it('should render sources inside video if defined', () => {
    wrapper = mount(<Media type="video" sources={[{ src: 'test1' }]} />)

    expect(wrapper.find('source')).toExist()
  })

  it('should render ReactImageMagnify if magnify prop is passed', () => {
    wrapper = mount(
      <Media magnify={{ src: 'test', width: 1000, height: 1000 }} src="test" alt="test" />,
    )

    expect(wrapper.find(ReactImageMagnify)).toExist()
  })

  it('should render image component if type is image', () => {
    wrapper = mount(<Media type="image" />)

    expect(wrapper.find(Image)).toExist()
  })
})
