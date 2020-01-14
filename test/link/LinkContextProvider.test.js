import React, { useContext } from 'react'
import LinkContextProvider from 'react-storefront/link/LinkContextProvider'
import LinkContext from 'react-storefront/link/LinkContext'
import { mount } from 'enzyme'
import { navigate } from '../mocks/mockRouter'

describe('LinkContextProvider', () => {
  let wrapper

  afterEach(() => {
    if (wrapper && wrapper.length) wrapper.unmount()
  })

  it('should provide LinkContext', () => {
    let context

    const Test = () => {
      context = useContext(LinkContext)
      return null
    }

    wrapper = mount(
      <LinkContextProvider>
        <Test />
      </LinkContextProvider>,
    )

    expect(context).toBeDefined()
  })

  it('should reset the LinkContext when the route changes', () => {
    let context

    const Test = () => {
      context = useContext(LinkContext)
      context.current = { foo: 'bar' }
      return null
    }

    wrapper = mount(
      <LinkContextProvider>
        <Test />
      </LinkContextProvider>,
    )

    expect(context.current).toEqual({ foo: 'bar' })
    navigate('/foo')
    expect(context.current).toBeUndefined()
  })

  it('should stop listening to the router when unmounted', () => {
    let context

    const Test = () => {
      context = useContext(LinkContext)
      context.current = { foo: 'bar' }
      return null
    }

    wrapper = mount(
      <LinkContextProvider>
        <Test />
      </LinkContextProvider>,
    )

    wrapper.unmount()
    navigate('/foo')
    expect(context.current).toEqual({ foo: 'bar' })
  })
})
