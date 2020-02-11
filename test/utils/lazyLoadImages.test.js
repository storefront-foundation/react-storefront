import React, { useEffect, createRef } from 'react'
import { mount } from 'enzyme'
import lazyLoadImages from 'react-storefront/utils/lazyLoadImages'

describe('lazyLoadImages', () => {
  let wrapper, observer, ref, imageRef, selector

  const Test = () => {
    useEffect(() => {
      observer = lazyLoadImages(ref.current, selector)
    }, [])

    return (
      <div ref={ref}>
        <img ref={imageRef} data-src="https://via.placeholder.com/600x600" data-rsf-lazy="1" />
      </div>
    )
  }

  beforeEach(() => {
    ref = createRef(null)
    imageRef = createRef(null)
  })

  afterEach(() => {
    if (wrapper) wrapper.unmount()
    ref = undefined
    imageRef = undefined
    selector = undefined
  })

  it('should do nothing if elements are undefined', () => {
    const querySelectorMock = jest.spyOn(HTMLElement.prototype, 'querySelectorAll')

    expect(lazyLoadImages(undefined)).toBe(undefined)
    expect(querySelectorMock).not.toBeCalled()
    querySelectorMock.mockRestore()
  })

  it('should do nothing if selector can not find anything', () => {
    selector = { selector: 'test' }

    wrapper = mount(<Test />)

    expect(observer).toBe(undefined)
  })

  it('should copy data-src to src when an image becomes visible', () => {
    wrapper = mount(<Test />)

    expect(ref.current.src).toBeUndefined()

    // Not intersected
    observer.simulateChange(0, imageRef.current)
    expect(ref.current.src).toBeUndefined()

    observer.simulateChange(1, imageRef.current)

    expect(imageRef.current.src).toBe('https://via.placeholder.com/600x600')
  })

  describe('if intersection observer is not available', () => {
    let IntersectionObserver

    beforeEach(() => {
      IntersectionObserver = window.IntersectionObserver
      delete window.IntersectionObserver
    })

    afterEach(() => {
      window.IntersectionObserver = IntersectionObserver
    })

    it('should eagerly load images', () => {
      wrapper = mount(<Test />)
      expect(imageRef.current.src).toBe('https://via.placeholder.com/600x600')
    })
  })
})
