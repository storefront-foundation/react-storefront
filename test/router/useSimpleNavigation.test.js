import React from 'react'
import { mount } from 'enzyme'
import useSimpleNavigation from 'react-storefront/router/useSimpleNavigation'
import Router, { navigate } from '../mocks/mockRouter'

describe('useSimpleNavigation', () => {
  let wrapper

  beforeEach(() => {
    global.fetchMock.mockResponseOnce(
      JSON.stringify({
        '/s/.*': {
          as: '/s/[subcategoryId]',
        },
        '/p/.*': {
          as: '/p/[productId]',
        },
      }),
    )
  })

  afterEach(() => {
    wrapper.unmount()
  })

  it('should call Router.push when a link is clicked if the URL matches a known route', async () => {
    const Test = () => {
      useSimpleNavigation()
      return (
        <a id="link" href="/p/1">
          Product 1
        </a>
      )
    }

    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<Test />, { attachTo: root })

    await sleep()
    document.querySelector('#link').click()

    expect(Router.push).toHaveBeenCalledWith({ pathname: '/p/[productId]', query: {} }, '/p/1')
  })

  it('should do nothing if the URL matches a known route and the anchor element has the data-native attribute', async () => {
    const Test = () => {
      useSimpleNavigation()
      return (
        <a id="link" href="/p/1" data-native>
          Product 1
        </a>
      )
    }

    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<Test />, { attachTo: root })

    await sleep()
    document.querySelector('#link').click()

    expect(Router.push).not.toHaveBeenCalled()
  })

  it("should do nothing if the href doesn't match a route", async () => {
    const Test = () => {
      useSimpleNavigation()
      return (
        <a id="link" href="/x/1">
          Product 1
        </a>
      )
    }

    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<Test />, { attachTo: root })

    await sleep()
    document.querySelector('#link').click()

    expect(Router.push).not.toHaveBeenCalled()
  })

  it('should not call Router.push if it is a next navigation', () => {
    const Test = () => {
      useSimpleNavigation()
      return <a id="link">Product 1</a>
    }
    const root = document.createElement('div')
    document.body.appendChild(root)
    wrapper = mount(<Test />, { attachTo: root })

    // next navigation mock
    navigate()
    document.querySelector('#link').click()

    expect(Router.push).not.toHaveBeenCalled()
  })
})
