import React from 'react'
import { mount } from 'enzyme'
import SearchForm from 'react-storefront/search/SearchForm'
import { act } from 'react-dom/test-utils'
import Router from '../mocks/mockRouter'

jest.useFakeTimers()

describe('SearchForm', () => {
  let wrapper

  afterEach(() => {
    wrapper.unmount()
    jest.restoreAllMocks()
  })

  beforeEach(() => {
    jest.spyOn(global, 'FormData').mockImplementation(() => ({
      entries: () => [
        ['key1', 'value1'],
        ['key2', 'value2'],
      ],
    }))
  })

  it('should render children', () => {
    wrapper = mount(
      <SearchForm>
        <div id="test">test</div>
      </SearchForm>,
    )

    expect(wrapper.find('#test')).toExist()
  })

  it('should be able to join query params from action prop on fetch call', async () => {
    wrapper = mount(<SearchForm action="/api/test?test=test1" />)

    await act(async () => {
      await wrapper.find('form').invoke('onSubmit')({ preventDefault: () => null })
      await wrapper.update()
    })

    expect(Router.push).toHaveBeenCalledWith(
      '/api/test',
      '/api/test?test=test1&key1=value1&key2=value2',
    )
  })

  it('should be able to append query params when action prop is without query params on fetch call', async () => {
    wrapper = mount(<SearchForm action="/api/test" />)

    await act(async () => {
      await wrapper.find('form').invoke('onSubmit')({ preventDefault: () => null })
      await wrapper.update()
    })

    expect(Router.push).toHaveBeenCalledWith('/api/test', '/api/test?key1=value1&key2=value2')
  })
})
