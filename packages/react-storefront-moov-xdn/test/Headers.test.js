import Headers from '../src/Headers'

describe('Headers', () => {
  it('should get headers regardless of case', () => {
    let headers
    headers = new Headers({ 'content-type': 'application/json' })
    expect(headers.get('Content-Type')).toBe('application/json')

    headers = new Headers({ 'Content-Type': 'application/json' })
    expect(headers.get('content-type')).toBe('application/json')
  })

  it('should accept no arguments', () => {
    expect(() => new Headers()).not.toThrowError()
  })

  it('should throw an error if key is null in call to get', () => {
    expect(() => new Headers().get()).toThrowError()
  })

  it('should throw an error if key is null in call to set', () => {
    expect(() => new Headers().set()).toThrowError()
  })

  it('should set headers regardless of case', () => {
    let headers
    headers = new Headers({})
    headers.set('Content-Type', 'application/json')
    expect(headers.get('content-type')).toBe('application/json')
  })

  it('(to be deprecated) should get header values directly on object', () => {
    let headers
    headers = new Headers({ foo: 'bar' })
    expect(headers.foo).toBe('bar')
  })

  it('(to be deprecated) should set header values directly on object', () => {
    let headers
    headers = new Headers({ foo: 'bar' })
    headers.baz = 'qux'
    expect(headers.baz).toBe('qux')
    expect(headers.foo).toBe('bar')
  })

  it('(to be deprecated) should list header keys', () => {
    let headers = new Headers({ foo: 'bar', baz: 'qux' })
    expect(Object.keys(headers).join()).toBe('foo,baz')
  })

  it('should stringify headers', () => {
    let headers = new Headers({ foo: 'bar', baz: 'qux' })
    expect(JSON.stringify(headers)).toBe('{"foo":"bar","baz":"qux"}')
  })

  it('should append headers when they dont exist', () => {
    let headers = new Headers()
    headers.append('foo', 'bar')
    expect(headers.get('foo')).toBe('bar')
  })

  it('should append headers when they do exist', () => {
    let headers = new Headers({ foo: 'bar' })
    headers.append('foo', 'baz')
    expect(headers.get('foo')).toBe('bar, baz')
  })

  it('should delete headers', () => {
    let headers = new Headers({ foo: 'bar' })
    expect(headers.get('foo')).toBe('bar')
    headers.delete('foo')
    expect(headers.get('foo')).toBe(undefined)
  })

  it('should have entries', () => {
    let headers = new Headers({ foo: 'bar', baz: 'qux' })
    let test = ''
    for (var pair of headers.entries()) {
      test += ' ' + pair[0] + ': ' + pair[1]
    }
    expect(test).toBe(' foo: bar baz: qux')
  })

  it('should check for existence of headers', () => {
    let headers = new Headers({ foo: 'bar', baz: 0 })
    expect(headers.has('foo')).toBe(true)
    expect(headers.has('bar')).toBe(false)
    expect(headers.has()).toBe(false)
    expect(headers.has('baz')).toBe(true)
  })

  it('should list header values', () => {
    let headers = new Headers({ foo: 'bar', baz: 'qux' })
    expect(headers.values().join()).toBe('bar,qux')
  })
})
