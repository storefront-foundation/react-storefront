import merge from 'react-storefront/utils/merge'

describe('merge', () => {
  it('should overwrite the target array with the source array', () => {
    expect(merge({ filters: ['foo'] }, { filters: ['bar'] })).toEqual({ filters: ['bar'] })
  })

  it('should keep the target array when the source array is undefined', () => {
    expect(merge({ filters: ['foo'] }, { filters: undefined })).toEqual({ filters: ['foo'] })
  })

  it('should keep the target array when the source array is missing', () => {
    expect(merge({ filters: ['foo'] }, {})).toEqual({ filters: ['foo'] })
  })

  it('should deep merge keys', () => {
    expect(merge({ product: { id: 1 } }, { product: { name: 'foo' } })).toEqual({
      product: { id: 1, name: 'foo' },
    })
  })
})
