import storeInitialPropsInHistory from 'react-storefront/router/storeInitialPropsInHistory'

describe('storeInitialPropsInHistory', () => {
  let originalReplaceState = history.replaceState

  beforeEach(() => {
    storeInitialPropsInHistory()
  })

  afterEach(() => {
    history.replaceState = originalReplaceState
  })

  it('should prevent next from overwriting rsf in history.state', () => {
    history.replaceState({ rsf: { foo: 'bar' } }, 'test', '/foo')
    history.replaceState({ as: '/foo' }, 'test', '/foo')
    expect(history.state).toEqual({ rsf: { foo: 'bar' }, as: '/foo' })
  })
})
