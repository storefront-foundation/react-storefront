import requestContext from '../src/requestContext'

describe('requestContext', () => {
  beforeEach(() => {
    global.env = {
      node_env: 'production',
      requestBody: '',
      headers: JSON.stringify({}),
      path: '/test',
      method: 'get',
      host: 'moovweb.com:80',
      host_no_port: 'moovweb.com',
      secure: true
    }
  })

  afterEach(() => {
    delete global.env
  })

  it('should get/set values', () => {
    requestContext.set('foo', 'bar')
    expect(requestContext.get('foo')).toBe('bar')
  })
})
