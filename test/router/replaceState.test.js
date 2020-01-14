import replaceState from 'react-storefront/router/replaceState'

describe('replaceState', () => {
  it('should set the "as" prop in state', () => {
    replaceState(null, null, '/foo')
    expect(history.state.as).toBe('/foo')
  })

  it('should update the current state', () => {
    replaceState({ foo: 'bar' }, null, '/foo')
    expect(history.state).toEqual({ foo: 'bar', as: '/foo' })
  })

  it('should preserve the current state when null state is passed', () => {
    replaceState({ foo: 'bar' }, null, '/foo')
    replaceState(null, null, '/bar')
    expect(history.state).toEqual({ foo: 'bar', as: '/bar' })
  })
})
