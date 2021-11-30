import React from 'react'
import { mount } from 'enzyme'
import MediaCarousel from 'react-storefront/carousel/MediaCarousel'
import MagnifyHint from 'react-storefront/carousel/MagnifyHint'
import Lightbox from 'react-storefront/carousel/Lightbox'
import Carousel from 'react-storefront/carousel/Carousel'
import Media from 'react-storefront/carousel/Media'
import Image from 'react-storefront/Image'
import { act } from 'react-dom/test-utils'
import CarouselThumbnails from 'react-storefront/carousel/CarouselThumbnails'
import * as useMediaQuery from '@mui/material/useMediaQuery/useMediaQuery'

jest.useFakeTimers()

describe('MediaCarousel', () => {
  let wrapper
  let media

  const mockMediaQuery = jest.spyOn(useMediaQuery, 'default')

  beforeEach(() => {
    window.innerWidth = 1024
    window.dispatchEvent(new Event('resize'))

    media = {
      full: [1, 2, 3].map(key => ({
        src: `test${key}`,
        alt: `test${key}`,
        magnify: {
          height: 1200,
          width: 1200,
          src: `test${key}`,
        },
      })),
      thumbnails: [1, 2, 3].map(key => ({
        src: `testThumb${key}`,
        alt: `testThumb${key}`,
      })),
    }
  })

  afterEach(() => {
    wrapper.unmount()
  })

  beforeAll(() => {
    jest.spyOn(console, 'warn').mockImplementation(() => null)
  })

  afterAll(() => {
    jest.restoreAllMocks()
  })

  it('should have MagnifyHint and thumbnails when media has those', () => {
    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(MagnifyHint)).toExist()
    expect(wrapper.find(CarouselThumbnails)).toExist()
  })

  it('should hide thumbnails if thumbnails prop are set to false', () => {
    wrapper = mount(<MediaCarousel media={media} thumbnails={false} />)

    expect(wrapper.find(CarouselThumbnails)).not.toExist()
  })

  it('should show thumbnails in the right position', () => {
    wrapper = mount(<MediaCarousel media={media} thumbnailPosition="left" />)
    expect(wrapper.find(CarouselThumbnails).prop('thumbnailPosition')).toBe('left')

    wrapper = mount(<MediaCarousel media={media} thumbnailPosition="right" />)
    expect(wrapper.find(CarouselThumbnails).prop('thumbnailPosition')).toBe('right')

    wrapper = mount(<MediaCarousel media={media} thumbnailPosition="top" />)
    expect(wrapper.find(CarouselThumbnails).prop('thumbnailPosition')).toBe('top')

    wrapper = mount(<MediaCarousel media={media} thumbnailPosition="bottom" />)
    expect(wrapper.find(CarouselThumbnails).prop('thumbnailPosition')).toBe('bottom')
  })

  it('should open lightbox on MediaCarousel click', () => {
    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
    wrapper.find(Carousel).simulate('click')
    expect(wrapper.find(Lightbox).prop('open')).toBe(true)
  })

  it('should not open lightbox on MediaCarousel click if active media is video', () => {
    media.full[0].type = 'video'

    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
    wrapper.find(Carousel).simulate('click')
    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
  })

  it('should not show MagnifyHint if active media is video', () => {
    media.full[0].type = 'video'

    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(MagnifyHint)).not.toExist()
  })

  it('should not open lightbox on MediaCarousel click if event is default prevented', () => {
    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
    wrapper.find(Carousel).invoke('onClick')({ defaultPrevented: true })
    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
  })

  it('should close lightbox ', () => {
    wrapper = mount(<MediaCarousel media={media} />)

    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
    wrapper.find(Carousel).simulate('click')
    expect(wrapper.find(Lightbox).prop('open')).toBe(true)
    wrapper.find(Lightbox).invoke('onClose')()
    expect(wrapper.find(Lightbox).prop('open')).toBe(false)
  })

  it('should pass magnify props to Media when lightbox is closed and window size is not small', () => {
    mockMediaQuery.mockReturnValue(false)

    wrapper = mount(<MediaCarousel media={media} />)

    expect(
      wrapper
        .find(Media)
        .first()
        .prop('magnify'),
    ).toStrictEqual(media.full[0].magnify)
  })

  it('should pass image props to Media when lightbox is opened and window size is not small', () => {
    mockMediaQuery.mockReturnValue(false)

    wrapper = mount(<MediaCarousel media={media} />)

    wrapper.find(Carousel).simulate('click')

    expect(
      wrapper
        .find(Media)
        .first()
        .prop('imageProps'),
    ).toStrictEqual({
      fill: false,
      contain: true,
      src: media.full[0].magnify.src,
    })

    expect(
      wrapper
        .find(Media)
        .first()
        .prop('src'),
    ).toEqual(media.full[0].magnify.src)
  })

  it('should pass height 100% to Carousel if window size is small and lightbox is opened', () => {
    mockMediaQuery.mockReturnValue(true)

    wrapper = mount(<MediaCarousel media={media} />)
    wrapper.find(Carousel).simulate('click')

    expect(
      wrapper
        .find(Carousel)
        .first()
        .prop('height'),
    ).toBe('100%')
  })

  it('should hide the magnify hint if the lightbox is opened and the window is wider than the image', () => {
    wrapper = mount(<MediaCarousel media={media} />)
    wrapper.find(Carousel).simulate('click')
    expect(wrapper.find(MagnifyHint)).toExist()

    window.innerWidth = 1300
    window.dispatchEvent(new Event('resize'))

    wrapper = mount(<MediaCarousel media={media} />)
    wrapper.find(Carousel).simulate('click')
    expect(wrapper.find(MagnifyHint)).not.toExist()
  })

  it('should pass thumbnail to render below the Carousel if image is not loaded and thumbnail is passed as prop', () => {
    wrapper = mount(<MediaCarousel media={media} thumbnail={{ test: 'test' }} />)

    expect(wrapper.find(Image).filterWhere(el => el.prop('test'))).toExist()
  })

  it('should not pass thumbnail to render below the Carousel if image is loaded ', async () => {
    const map = {}
    const loadMock = jest
      .spyOn(HTMLImageElement.prototype, 'addEventListener')
      .mockImplementation((event, cb) => {
        map[event] = cb
      })

    wrapper = mount(<MediaCarousel media={media} thumbnail={{ test: 'test' }} />)

    await act(async () => {
      await map.load()
      await wrapper.update()
    })

    expect(wrapper.find(Image).filterWhere(el => el.prop('test'))).not.toExist()

    loadMock.mockClear()
  })

  it('should not add img listener if there is no image', async () => {
    const loadMock = jest.spyOn(HTMLImageElement.prototype, 'addEventListener')

    wrapper = mount(
      <MediaCarousel
        thumbnails={false}
        media={{ full: [{ src: 'test', alt: 'test', type: 'video' }] }}
      />,
    )

    expect(loadMock).not.toBeCalled()
    loadMock.mockClear()
  })

  it('should not add img listener if the only image is the preview thumbnail', async () => {
    const loadMock = jest.spyOn(HTMLImageElement.prototype, 'addEventListener')

    wrapper = mount(<MediaCarousel thumbnails={false} thumbnail={{ test: 'test' }} />)

    expect(loadMock).not.toBeCalled()
    loadMock.mockClear()
  })

  it('should have timeout on magnifying carousel', async () => {
    wrapper = mount(<MediaCarousel media={media} />)

    wrapper.find(Carousel).invoke('onMouseEnter')()

    expect(wrapper.find(MagnifyHint).prop('over')).toBe(false)

    await act(async () => {
      await jest.runOnlyPendingTimers()
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(MagnifyHint).prop('over')).toBe(true)

    wrapper.find(Carousel).invoke('onMouseLeave')()

    expect(wrapper.find(MagnifyHint).prop('over')).toBe(false)
  })

  it('should not magnify if you exit carousel before timeout', async () => {
    jest.useRealTimers()
    wrapper = mount(<MediaCarousel media={media} />)

    wrapper.find(Carousel).invoke('onMouseEnter')()

    expect(wrapper.find(MagnifyHint).prop('over')).toBe(false)

    await act(async () => {
      await sleep(1)
      wrapper.find(Carousel).invoke('onMouseLeave')()
      setImmediate(() => wrapper.update())
    })

    expect(wrapper.find(MagnifyHint).prop('over')).toBe(false)
  })
})
