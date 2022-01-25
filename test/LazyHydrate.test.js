import React from 'react'
import { mount } from 'enzyme'
import { styled } from '@mui/material/styles'
import { act } from 'react-dom/test-utils'

describe('LazyHydrate', () => {
  let isBrowser, LazyHydrate, LazyStyles, getRegistryCount, wrapper, Router

  afterEach(() => {
    wrapper && wrapper.unmount()
  })

  describe('on the server', () => {
    beforeEach(() => {
      jest.isolateModules(() => {
        isBrowser = jest.doMock('react-storefront/utils/isBrowser', () => () => false)
        const mod = require('react-storefront/LazyHydrate')
        LazyHydrate = mod.default
        LazyStyles = mod.LazyStyles
        getRegistryCount = mod.getRegistryCount
      })
    })

    it('should clear registries', () => {
      const PREFIX = 'LazyHydrate.test'
      const classes = {
        root: `${PREFIX}-root`,
        '@media (min-width: 1024px)': `${PREFIX}-@media (min-width: 1024px)`,
      }
      const Root = styled('button')(() => ({
        [`& .${classes.root}`]: {
          fontWeight: 'bold',
          'media (min-width: 1024px)': {
            width: 200,
          },
        },
      }))

      const TestComponent = () => {
        return <Root className={classes.root}>click</Root>
      }

      const hydrate = mount(
        <LazyHydrate id="test">
          <TestComponent />
        </LazyHydrate>,
      )
      expect(getRegistryCount()).toBe(1)
      wrapper = mount(
        <div>
          <LazyStyles />
        </div>,
      )
      expect(getRegistryCount()).toBe(0)
      hydrate.unmount()
    })

    it('should render children during SSR only mode', () => {
      const click = jest.fn()
      wrapper = mount(
        <LazyHydrate id="test" ssrOnly>
          <button onClick={click}>click</button>
        </LazyHydrate>,
      )
      expect(wrapper.html()).toContain('<button>click</button>')
    })
  })

  describe('in the browser', () => {
    let events, intersectionObserverCallback, intersectionObserverFallback

    beforeEach(() => {
      jest.isolateModules(() => {
        events = {}
        isBrowser = jest.doMock('react-storefront/utils/isBrowser', () => () => true)
        Router = jest.doMock('next/router', () => ({
          events: {
            on: (name, callback) => {
              events[name] = callback
            },
          },
        }))
        jest.doMock('react-storefront/hooks/useIntersectionObserver', () => {
          return (_el, callback, fallback) => {
            intersectionObserverCallback = callback
            intersectionObserverFallback = fallback
          }
        })
        const mod = require('react-storefront/LazyHydrate')
        LazyHydrate = mod.default
        LazyStyles = mod.LazyStyles
        getRegistryCount = mod.getRegistryCount
      })
    })
    it('should pass event through when hydrated', () => {
      const click = jest.fn()
      wrapper = mount(
        <LazyHydrate id="test" hydrated>
          <button onClick={click}>click</button>
        </LazyHydrate>,
      )
      wrapper.find('button').simulate('click')
      expect(click).toHaveBeenCalled()
    })
    it('should not render children in the browser during SSR only mode', () => {
      const click = jest.fn()
      wrapper = mount(
        <LazyHydrate id="test" ssrOnly>
          <button onClick={click}>click</button>
        </LazyHydrate>,
      )
      expect(wrapper.find('button').length).toBe(0)
    })
    it('should hydrate in browser once triggered', () => {
      wrapper = mount(
        <LazyHydrate id="test" hydrated={false}>
          <button>click</button>
        </LazyHydrate>,
      )
      expect(wrapper.html()).not.toContain('<button>click</button>')
      wrapper.setProps({ hydrated: true })
      expect(wrapper.html()).toContain('<button>click</button>')
    })

    it('should hydrate new elements immediately after navigation', () => {
      events.routeChangeStart()
      wrapper = mount(
        <LazyHydrate id="test" hydrated={false}>
          <button>click</button>
        </LazyHydrate>,
      )
      expect(wrapper.html()).toContain('<button>click</button>')
    })

    it('should remove the server side style sheet after hydration', () => {
      const style = document.createElement('style')
      style.setAttribute('id', 'test')
      document.head.appendChild(style)
      wrapper = mount(
        <LazyHydrate id="test" hydrated={false}>
          <button>click</button>
        </LazyHydrate>,
      )
      wrapper.setProps({ hydrated: true })
      expect(document.querySelector('style[id=test]')).toBe(null)
    })

    it('should hydrate on touch', async () => {
      wrapper = mount(
        <LazyHydrate id="test" on="touch">
          <button>click</button>
        </LazyHydrate>,
      )

      await act(async () => {
        wrapper.getDOMNode().dispatchEvent(new Event('touchstart'))
      })

      expect(wrapper.html()).toContain('<button>click</button>')
    })

    it('should hydrate on the first user interaction with the window', async () => {
      wrapper = mount(
        <LazyHydrate id="test" on="fui">
          <button>click</button>
        </LazyHydrate>,
      )

      await act(async () => {
        window.dispatchEvent(new Event('mouseover'))
      })

      expect(wrapper.html()).toContain('<button>click</button>')
    })

    it('should hydrate when visible', async () => {
      wrapper = mount(
        <LazyHydrate id="test" on="visible">
          <button>click</button>
        </LazyHydrate>,
      )

      await act(async () => {
        intersectionObserverCallback(true, jest.fn())
      })

      expect(wrapper.html()).toContain('<button>click</button>')
    })

    it('should not hydrate when not visible', async () => {
      wrapper = mount(
        <LazyHydrate id="test" on="visible">
          <button>click</button>
        </LazyHydrate>,
      )

      await act(async () => {
        intersectionObserverCallback(false, jest.fn())
      })

      expect(wrapper.html()).not.toContain('<button>click</button>')
    })
  })
})
