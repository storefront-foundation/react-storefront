/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import parseMultipartRequest from '../../src/router/parseMultipartRequest'

describe('parseMultipartRequest', () => {
  it('should parse', () => {
    const request = {
      body: 
`------WebKitFormBoundaryJv1eDdVdR3gaMjcE\r
Content-Disposition: form-data; name="foo"\r
\r
bar\r
------WebKitFormBoundaryJv1eDdVdR3gaMjcE--`
      ,
      headers: {
        "content-type": "multipart/form-data; boundary=----WebKitFormBoundaryJv1eDdVdR3gaMjcE"
      }
    }

    expect(parseMultipartRequest(request)).toEqual({ foo: 'bar' })
  })
  
})