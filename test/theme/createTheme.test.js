import createTheme from 'react-storefront/theme/createTheme'

describe('createTheme', () => {
  it('should return a material UI theme', () => {
    const theme = createTheme({
      foo: 'bar',
    })

    expect(theme.foo).toBe('bar')
  })

  it('should provide maxWidth', () => {
    const theme = createTheme({})
    expect(theme.maxWidth).toBeDefined()
  })

  it('should should use the provided maxWidth', () => {
    const theme = createTheme({ maxWidth: 1000 })
    expect(theme.maxWidth).toBe(1000)
  })

  it('should not require values', () => {
    expect(() => createTheme()).not.toThrowError()
  })

  it('should provide default zIndexes for react and amp', () => {
    const theme = createTheme()
    expect(theme.zIndex.modal).toBe(999)
    expect(theme.zIndex.amp.modal).toBe(2147483646)
  })

  it('should deep merge the provided values', () => {
    expect(createTheme({ zIndex: { amp: { modal: 10 } } }).zIndex.amp.modal).toBe(10)
  })

  it('should provide loadMaskOffsetTop', () => {
    expect(createTheme().loadMaskOffsetTop).toBeDefined()
  })

  it('should provide drawerWidth', () => {
    expect(createTheme().drawerWidth).toBeDefined()
  })

  it('should provide headerHeight', () => {
    expect(createTheme().headerHeight).toBeDefined()
  })
})
