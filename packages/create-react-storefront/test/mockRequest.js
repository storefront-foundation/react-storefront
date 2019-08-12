import Request from 'react-storefront-moov-xdn/Request'
import Response from 'react-storefront-moov-xdn/Response'

export default function mockRequest({ protocol="https", hostname='localhost', method="GET", path="/", headers={}, body={} } = {}) {
  global.env = {
    method, 
    path, 
    protocol,
    host_no_port: hostname,
    headers: JSON.stringify(headers),
    secure: protocol === 'https',
    host: hostname,
    body: typeof body === 'string' ? body : JSON.stringify(body)
  }
  const request = new Request()
  const response = new Response(request)
  return { request, response }
}