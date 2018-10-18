/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
/** 
 * AMP forms post using multipart/form-data encoding.  This function parses that format
 * into an object of key/value pairs
 * 
 * Copyright@ 2013-2014 Wolfgang Kuehn, released under the MIT license.
 * 
 * @param {Object} request The request object passed into a fromServer route handler
 * @return {Object} The form values
 */
export default function parseMultipartRequest({ body, headers }) {
  const contentType = headers['content-type']

  var s, fieldName;

  // Examples for content types:
  //      multipart/form-data; boundary="----7dd322351017c"; ...
  //      multipart/form-data; boundary=----7dd322351017c; ...
  var m = contentType.match(/boundary=(?:"([^"]+)"|([^;]+))/i);

  if ( !m ) {
      throw new Error('Bad content-type header, no multipart boundary');
  }

  var boundary = m[1] || m[2];

  function Header_parse(header) {
      var headerFields = {};
      var matchResult = header.match(/^.*name="([^"]*)"$/);
      if ( matchResult ) headerFields.name = matchResult[1];
      return headerFields;
  }

  function rawStringToBuffer( str ) {
      var idx, len = str.length, arr = new Array( len );
      for ( idx = 0 ; idx < len ; ++idx ) {
          arr[ idx ] = str.charCodeAt(idx) & 0xFF;
      }
      return new Uint8Array( arr ).buffer;
  }

  // \r\n is part of the boundary.
  var boundary = '\r\n--' + boundary;

  var isRaw = typeof(body) !== 'string';

  if ( isRaw ) {
      var view = new Uint8Array( body );
      s = String.fromCharCode.apply(null, view);
  } else {
      s = body;
  }

  // Prepend what has been stripped by the body parsing mechanism.
  s = '\r\n' + s;

  var parts = s.split(new RegExp(boundary)),
      partsByName = {};

  // First part is a preamble, last part is closing '--'
  for (var i=1; i<parts.length-1; i++) {
    var subparts = parts[i].split('\r\n\r\n');
    var headers = subparts[0].split('\r\n');
    for (var j=1; j<headers.length; j++) {
      var headerFields = Header_parse(headers[j]);
      if ( headerFields.name ) {
          fieldName = headerFields.name;
      }
    }

    partsByName[fieldName] = isRaw?rawStringToBuffer(subparts[1]):subparts[1];
  }

  return partsByName;
}