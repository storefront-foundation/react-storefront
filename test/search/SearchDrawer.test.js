import React from 'react'
import { mount } from 'enzyme'
import SearchDrawer from 'react-storefront/search/SearchDrawer'
import { navigate } from '../mocks/mockRouter'

describe('SearchDrawer', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
  })

  it('should render children', () => {
    wrapper = mount(
      <SearchDrawer open onClose={() => null}>
        <div id="test" />
      </SearchDrawer>,
    )

    expect(wrapper.find('#test')).toExist()
  })

  it('should work without onClose', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(null)
    wrapper = mount(
      <SearchDrawer open onClose={null}>
        <div id="test" />
      </SearchDrawer>,
    )
    navigate('/foo')
    expect(wrapper.find('#test')).toExist()

    consoleSpy.mockRestore()
  })

  it('should call onClose  on navigation', async () => {
    const onCloseMock = jest.fn()

    wrapper = mount(
      <SearchDrawer onClose={onCloseMock}>
        <div></div>
      </SearchDrawer>,
    )

    expect(onCloseMock).not.toHaveBeenCalled()
    navigate('/foo')
    expect(onCloseMock).toHaveBeenCalled()
  })
})
