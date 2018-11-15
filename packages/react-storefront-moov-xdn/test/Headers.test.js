import Headers from '../src/Headers'

describe('Headers', () => {
  it('should get headers regardless of case', () => {
    let headers 
    headers = new Headers({ "content-type": "application/json"})
    expect(headers.get('Content-Type')).toBe('application/json')

    headers = new Headers({ "Content-Type": "application/json"})
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
    headers = new Headers({ })
    headers.set('Content-Type', 'application/json')
    expect(headers.get('content-type')).toBe('application/json')
  })
})