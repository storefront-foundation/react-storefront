import fetch from '../fetch'

export default async function getBase64ForImage(src) {
  const res = await fetch(src)
  const contentType = res.headers.get('content-type')
  const buffer = Buffer.from(await res.arrayBuffer())
  return `data:${contentType};base64,${buffer.toString('base64')}`
}
