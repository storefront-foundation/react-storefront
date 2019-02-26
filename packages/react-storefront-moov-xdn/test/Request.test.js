/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import Request from '../src/Request'
import { body, contentType } from './parseMultipartRequest.test'
import headers from './headers'

describe('Request', () => {
  global.env = { 
    path: '/',
    host: 'localhost:80',
    headers: JSON.stringify({})
  }

  it('should warn when you access pathname', () => {
    console.warn = jest.fn()
    expect(new Request().pathname).toBe('/')
    expect(console.warn).toHaveBeenCalledWith('warning: request.pathname is deprecated and will be removed in a future version of react-storefront-moov-xdn')
  })

  it('should populate search', () => {
    global.env.path = '/s/1?filter=foo'
    const request = new Request()
    expect(request.search).toBe('?filter=foo')
    expect(request.path).toBe('/s/1')
  })

  it('should populate port', () => {
    global.env.host = 'localhost'
    global.env.secure = true
    expect(new Request().port).toBe('443')

    global.env.host = 'localhost'
    global.env.secure = false
    expect(new Request().port).toBe('80')
  })

  it('should populate protocol', () => {
    global.env.host_no_port = 'localhost'
    global.env.secure = false
    expect(new Request().protocol).toBe('http:')

    global.env.host_no_port = 'example.com'
    global.env.secure = true
    expect(new Request().protocol).toBe('https:')
  })

  it('should populate headers from the moov headers namespace', () => {
    delete global.env.headers
    global.headers = headers
    global.requestBody = JSON.stringify({ foo: 'bar' })
    headers.header('content-type', 'application/json')
    expect(new Request().headers.get('content-type')).toEqual('application/json')
  })

  it('should parse a json body', () => {
    global.requestBody = JSON.stringify({ foo: 'bar' })
    global.env.headers = JSON.stringify({ 'content-type': 'application/json' })
    expect(new Request().body).toEqual({ foo: 'bar' })
  })

  it('should throw an error when parsing malformed json', () => {
    global.requestBody = '{ foo: "bar" '
    global.env.headers = JSON.stringify({ 'content-type': 'application/json' })
    expect(() => new Request().body).toThrowError()
  })

  it('should parse application/x-www-form-urlencoded', () => {
    global.requestBody = 'foo=bar'
    global.env.headers = JSON.stringify({ 'content-type': 'application/x-www-form-urlencoded' })
    expect(new Request().body).toEqual({ foo: 'bar' })
  })

  it('should parse multipart/form data', () => {
    global.requestBody = body
    global.env.headers = JSON.stringify({ 'content-type': contentType })
    expect(new Request().body).toEqual({ foo: 'bar' })
  })

  it('should throw an error when parsing malformed multipart/form-data', () => {
    global.requestBody = 'gsfdghdf'
    global.env.headers = JSON.stringify({ 'content-type': 'multipart/form-data' })
    expect(() => new Request().body).toThrowError()
  })
})