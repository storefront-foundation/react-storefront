import edgeResponseTransform from '../src/edgeResponseTransform'

describe('edgeResponseTransform', () => {
  let warn = console.warn

  beforeEach(() => {
    console.warn = jest.fn()
  })

  afterEach(() => {
    console.warn = warn
  })

  it('should issue a deprecation warning', () => {
    edgeResponseTransform()
    expect(console.warn).toHaveBeenCalled()
  })
})
