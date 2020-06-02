import React, { useRef } from 'react'
import useIntersectionObserver from 'react-storefront/hooks/useIntersectionObserver'
import { mount } from 'enzyme'

describe('useIntersectionObserver', () => {
  let disconnected = false

  it('should fire the callback when the element becomes visible', () => {
    const onChange = jest.fn()

    const Test = () => {
      const ref = useRef(null)
      useIntersectionObserver(() => ref, onChange)
      return <div ref={ref} />
    }

    mount(<Test />)
    const { instance } = IntersectionObserver
    expect(instance).not.toBeNull()
    instance.simulateChange(0.5)
    expect(onChange).toHaveBeenCalledWith(true, expect.any(Function))
    expect(instance.ref).not.toBeNull()
  })

  it('should disconnect when the component is unmounted', () => {
    const onChange = jest.fn()

    const Test = () => {
      const ref = useRef(null)
      useIntersectionObserver(() => ref, onChange)
      return <div ref={ref} />
    }

    const wrapper = mount(<Test />)
    wrapper.unmount()
    expect(IntersectionObserver.instance.disconnected).toBe(true)
  })

  it('should handle a null ref', () => {
    const Test = () => {
      useIntersectionObserver(() => null, jest.fn())
      return <div />
    }
    expect(() => {
      mount(<Test />)
    }).not.toThrowError()
  })

  describe('when IntersectionObserver is not supported', () => {
    let IntersectionObserver

    beforeEach(() => {
      IntersectionObserver = window.IntersectionObserver
      delete window.IntersectionObserver
    })

    afterEach(() => {
      window.IntersectionObserver = IntersectionObserver
    })

    it('should call the not supported callback', () => {
      const notSupported = jest.fn()

      const Test = () => {
        useIntersectionObserver(() => null, jest.fn(), [], notSupported)
        return <div />
      }

      expect(() => {
        mount(<Test />)
      }).not.toThrowError()

      expect(notSupported).toHaveBeenCalled()
    })
  })
})
