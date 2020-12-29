import fetch from '../fetch'

export default async function getBase64ForImage(...args) {
  const res = await fetch(...args)
  const contentType = res.headers.get('content-type')
  const buffer = await res.buffer()
  return `data:${contentType};base64,${buffer.toString('base64')}`
}
