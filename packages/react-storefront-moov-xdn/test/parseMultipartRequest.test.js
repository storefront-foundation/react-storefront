/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import parseMultipartRequest from '../src/parseMultipartRequest'

export const body = 
`------WebKitFormBoundaryJv1eDdVdR3gaMjcE\r
Content-Disposition: form-data; name="foo"\r
\r
bar\r
------WebKitFormBoundaryJv1eDdVdR3gaMjcE--`

export const contentType = "multipart/form-data; boundary=----WebKitFormBoundaryJv1eDdVdR3gaMjcE"

describe('parseMultipartRequest', () => {
  it('should parse', () => {
    expect(parseMultipartRequest(body, contentType)).toEqual({ foo: 'bar' })
  })

  it('should throw an error when no boundary is specified', () => {
    expect(() => parseMultipartRequest(body, 'multipart/form-data')).toThrowError()
  })
  
  it('should parse a Buffer', () => {
    const result = parseMultipartRequest(Buffer.from(body, 'utf8'), contentType)
    expect(result.foo).toBeInstanceOf(ArrayBuffer)
  })
})