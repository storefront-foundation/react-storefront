import edgeResponseTransform from '../src/edgeResponseTransform'

describe('edgeResponseTransform', () => {

  beforeEach(() => {
    const headers = { }
    global.env = {}
    global.headers = {
      header: (name, value) => {
        if (value == null) {
          return headers[name.toLowerCase()]
        } else {
          headers[name.toLowerCase()] = value
        }
      }
    }
  })

  it('should remove s-maxage when behind the outer edge', () => {
    global.env.behindOuterEdge = 'false'
    headers.header('cache-control', 'no-cache, s-maxage=300')
    edgeResponseTransform()
    expect(headers.header('cache-control')).toBe('no-cache')
  })

  it('should not remove s-maxage when not behind the outer edge', () => {
    global.env.behindOuterEdge = 'true'
    headers.header('cache-control', 'no-cache, s-maxage=300')
    edgeResponseTransform()
    expect(headers.header('cache-control')).toBe('no-cache, s-maxage=300')
  })

  it('should do nothing if no cache-control header is present', () => {
    edgeResponseTransform()
    expect(headers.header('cache-control')).toBeUndefined()
  })

})