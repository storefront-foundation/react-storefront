import React, { createRef } from 'react'
import { mount } from 'enzyme'
import LinkContext from 'react-storefront/link/LinkContext'

describe('Link', () => {
  let wrapper, prefetch, Link

  beforeEach(() => {
    prefetch = jest.fn()

    jest.isolateModules(() => {
      jest.doMock('react-storefront/serviceWorker', () => ({ prefetch }))
      Link = require('react-storefront/link/Link').default
    })
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should forward pageData to useLazyState', () => {
    const ref = createRef(null)

    const product = {
      id: '1',
      name: 'Product 1',
    }

    const Test = () => {
      return (
        <LinkContext.Provider value={ref}>
          <Link as={`/p/${product.id}`} href="/product/[productId]" pageData={{ product }}>
            {product.name}
          </Link>
        </LinkContext.Provider>
      )
    }

    wrapper = mount(<Test />)
    expect(ref.current).toBeNull()
    wrapper.find(Link).simulate('click')
    expect(ref.current).toEqual({ product })
  })

  it('should call the onClick prop', () => {
    const onClick = jest.fn()

    const Test = () => {
      return (
        <Link as="/p/1" href="/p/[productId]" onClick={onClick}>
          Product 1
        </Link>
      )
    }

    wrapper = mount(<Test />)
    wrapper.find(Link).simulate('click')
    expect(onClick).toHaveBeenCalled()
  })

  describe('prefetch', () => {
    it('should support prefetch=visible', () => {
      const Test = () => {
        return (
          <Link as="/p/1" href="/p/[productId]" prefetch="visible">
            Product 1
          </Link>
        )
      }

      wrapper = mount(<Test />)
      const { instance } = IntersectionObserver
      instance.simulateChange(0.5)
      expect(prefetch).toHaveBeenCalledWith('/api/p/1')
      expect(IntersectionObserver.instance.disconnected).toBe(true)
    })

    it('should not prefetch prefetch=visible and the Link is off screen', () => {
      const Test = () => {
        return (
          <Link as="/p/1" href="/p/[productId]" prefetch="visible">
            Product 1
          </Link>
        )
      }

      wrapper = mount(<Test />)
      const { instance } = IntersectionObserver
      instance.simulateChange(0)
      expect(prefetch).not.toHaveBeenCalled()
      expect(IntersectionObserver.instance.disconnected).toBe(false)
    })

    it('should support prefetch=always', () => {
      const Test = () => {
        return (
          <Link as="/p/1" href="/p/[productId]" prefetch="always">
            Product 1
          </Link>
        )
      }

      wrapper = mount(<Test />)
      expect(prefetch).toHaveBeenCalledWith('/api/p/1')
    })

    it('should prefetch=false', () => {
      const Test = () => {
        return (
          <Link as="/p/1" href="/p/[productId]">
            Product 1
          </Link>
        )
      }

      wrapper = mount(<Test />)
      expect(prefetch).not.toHaveBeenCalled()
    })
  })
})
