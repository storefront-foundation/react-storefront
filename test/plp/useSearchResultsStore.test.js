import * as useLazyStore from 'react-storefront/hooks/useLazyStore'
import useSearchResultsStore from 'react-storefront/plp/useSearchResultsStore'

describe('useSearchResultsStore', () => {
  it('should call useLazyStore with right params and return useLazyStore result', () => {
    const testObj = {
      test: 'test',
    }

    const lazyStoreSpy = jest.spyOn(useLazyStore, 'default').mockReturnValue(true)
    const res = useSearchResultsStore(testObj)

    expect(res).toBe(true)
    expect(lazyStoreSpy.mock.calls[0][0]).toBe(testObj)
  })
})
