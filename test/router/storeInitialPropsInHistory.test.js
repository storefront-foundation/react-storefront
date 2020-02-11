import storeInitialPropsInHistory from 'react-storefront/router/storeInitialPropsInHistory'

describe('storeInitialPropsInHistory', () => {
  let originalReplaceState = history.replaceState

  afterEach(() => {
    history.replaceState = originalReplaceState
  })

  it('should prevent next from overwriting rsf in history.state', () => {
    storeInitialPropsInHistory()

    history.replaceState({ rsf: { foo: 'bar' } }, 'test', '/foo')
    history.replaceState({ as: '/foo' }, 'test', '/foo')
    expect(history.state).toEqual({ rsf: { foo: 'bar' }, as: '/foo' })
  })

  it('should not throw error when window is undefined', () => {
    jest.spyOn(global, 'window', 'get').mockImplementation(() => undefined)
    storeInitialPropsInHistory()

    history.replaceState({ rsf: { foo: 'bar' } }, 'test', '/foo')
    history.replaceState({ as: '/foo' }, 'test', '/foo')
    expect(history.state).toEqual({ as: '/foo' })
  })
})
