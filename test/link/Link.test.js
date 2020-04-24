import React, { createRef } from 'react'
import { mount } from 'enzyme'
import LinkContext from 'react-storefront/link/LinkContext'

describe('Link', () => {
  let wrapper, Link

  beforeEach(() => {
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
})
