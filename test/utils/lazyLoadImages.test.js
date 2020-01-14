import React, { useEffect, createRef } from 'react'
import { mount } from 'enzyme'
import lazyLoadImages from 'react-storefront/utils/lazyLoadImages'

describe('lazyLoadImages', () => {
  let wrapper

  beforeEach(() => {})

  afterEach(() => {
    if (wrapper) wrapper.unmount()
  })

  it('should copy data-src to src when an image becomes visible', () => {
    let observer
    const ref = createRef(null),
      image = createRef(null)

    const Test = () => {
      useEffect(() => {
        observer = lazyLoadImages(ref.current)
      }, [])

      return (
        <div ref={ref}>
          <img ref={image} data-src="https://via.placeholder.com/600x600" data-rsf-lazy="1" />
        </div>
      )
    }

    wrapper = mount(<Test />)
    expect(ref.current.src).toBeUndefined()
    observer.simulateChange(100, image.current)
    expect(image.current.src).toBe('https://via.placeholder.com/600x600')
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
      let observer
      const ref = createRef(null),
        image = createRef(null)

      const Test = () => {
        useEffect(() => {
          observer = lazyLoadImages(ref.current)
        }, [])

        return (
          <div ref={ref}>
            <img ref={image} data-src="https://via.placeholder.com/600x600" data-rsf-lazy="1" />
          </div>
        )
      }

      wrapper = mount(<Test />)
      expect(image.current.src).toBe('https://via.placeholder.com/600x600')
    })
  })
})
