import React from 'react'
import { mount } from 'enzyme'
import BackToTop from 'react-storefront/BackToTop'
import { ArrowBack as CustomIcon } from '@material-ui/icons'
import { Fab } from '@material-ui/core'
import { act } from 'react-dom/test-utils'

describe('BackToTop', () => {
  const map = {}
  const initialScrollY = window.scrollY
  const initialPageYOffset = window.pageYOffset
  let wrapper

  beforeEach(() => {
    jest.spyOn(window, 'addEventListener').mockImplementation((event, cb) => {
      map[event] = cb
    })
    jest.spyOn(window, 'scrollTo').mockImplementation(options => options)
    jest.spyOn(HTMLElement.prototype, 'offsetParent', 'get').mockImplementation(() => true)
  })

  afterEach(() => {
    wrapper.unmount()
    jest.restoreAllMocks()
    window.scrollY = initialScrollY
    window.pageYOffset = initialPageYOffset
  })

  it('should accept custom icon', () => {
    wrapper = mount(<BackToTop Icon={() => <CustomIcon />} />)

    expect(wrapper.find(CustomIcon).exists()).toBe(true)
  })

  it('should show back to top button when scrolled more than showUnderY prop value', () => {
    window.pageYOffset = 201
    wrapper = mount(<BackToTop showUnderY={200} />)

    act(() => {
      map.scroll()
    })

    expect(wrapper.find(Fab).prop('style').visibility).toBe('hidden')

    wrapper.find(Fab).simulate('click')

    expect(wrapper.find(Fab).prop('style').visibility).toBe(undefined)
  })

  it('should scroll to top instantly if scroll position is more than instantBehaviorUnderY prop value', () => {
    window.scrollY = 300
    wrapper = mount(<BackToTop instantBehaviorUnderY={250} />)

    act(() => {
      map.scroll()
    })

    wrapper.find(Fab).simulate('click')
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'auto', left: 0, top: 0 })
  })

  it('should scroll to top smoothly if scroll position is less than instantBehaviorUnderY prop value', () => {
    window.pageYOffset = 201
    wrapper = mount(<BackToTop instantBehaviorUnderY={250} />)

    act(() => {
      map.scroll()
    })

    wrapper.find(Fab).simulate('click')
    expect(window.scrollTo).toHaveBeenCalledWith({ behavior: 'smooth', left: 0, top: 0 })
  })
})
