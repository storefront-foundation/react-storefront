import React from 'react'
import { mount } from 'enzyme'
import SearchResultsContext from 'react-storefront/plp/SearchResultsContext'
import ShowMore from 'react-storefront/plp/ShowMore'
import { act } from 'react-dom/test-utils'
import VisibilitySensor from 'react-visibility-sensor'

jest.useFakeTimers()

describe('ShowMore', () => {
  let wrapper

  afterEach(() => {
    try {
      wrapper.unmount()
      fetch.resetMocks()
      jest.restoreAllMocks()
    } catch (e) {}
  })

  describe('with pageData present in context', () => {
    it('does not render when page nr over page count', () => {
      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{ pageData: { page: 4, totalPages: 5 } }}>
            <ShowMore
              variant="button"
              renderLoadingIcon={() => <div className="loading">Loading</div>}
            />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)
      expect(wrapper.isEmptyRender()).toBe(true)
    })

    it('renders when page nr under page count', () => {
      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{ pageData: { page: 3, totalPages: 5 } }}>
            <ShowMore
              variant="button"
              renderLoadingIcon={() => <div className="loading">Loading</div>}
            />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)
      expect(wrapper.isEmptyRender()).toBe(false)
    })
  })

  describe('button variant', () => {
    it('calls fetchMore when button clicked and renders loading icon', async () => {
      const fetchMoreStub = jest.fn()
      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{ actions: { fetchMore: fetchMoreStub } }}>
            <ShowMore
              variant="button"
              renderLoadingIcon={() => <div className="loading">Loading</div>}
            />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)
      expect(wrapper.find('div.loading')).not.toExist()
      wrapper.find('button').simulate('click')
      expect(fetchMoreStub).toBeCalled()
      expect(wrapper.find('div.loading')).toExist()

      await act(async () => {
        await fetchMoreStub.mockReturnValue(() => Promise.resolve())
        await wrapper.update()
      })

      expect(wrapper.find('div.loading')).not.toExist()
    })
  })

  describe('infinite variant', () => {
    it('renders a loading icon', () => {
      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{}}>
            <ShowMore
              variant="infinite"
              renderLoadingIcon={() => <div className="loading">Loading</div>}
            />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)
      expect(wrapper.find('div.loading')).toExist()
    })

    it('fetches more results when is visible', async () => {
      const fetchSpy = jest.fn()
      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{ actions: { fetchMore: fetchSpy } }}>
            <ShowMore variant="infinite" />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)

      await act(async () => {
        await wrapper.find(VisibilitySensor).invoke('onChange')(true)
        await wrapper.update()
      })

      expect(fetchSpy).toHaveBeenCalled()
    })

    it('should trigger fetch only once, while already loading', async () => {
      const fetchSpy = () => {
        return fetch('test')
      }

      const Test = () => {
        return (
          <SearchResultsContext.Provider value={{ actions: { fetchMore: fetchSpy } }}>
            <ShowMore variant="infinite" />
          </SearchResultsContext.Provider>
        )
      }

      wrapper = mount(<Test />)

      fetch.mockResponseOnce(async () => {
        await sleep(1000)
        return { body: JSON.stringify({}) }
      })

      await act(async () => {
        wrapper.find(VisibilitySensor).invoke('onChange')(true)
        setImmediate(() => wrapper.update())
      })

      wrapper.find(VisibilitySensor).invoke('onChange')(true)

      await act(async () => {
        jest.runOnlyPendingTimers()
        setImmediate(() => wrapper.update())
      })

      expect(fetch).toHaveBeenCalledTimes(1)
    })
  })
})
