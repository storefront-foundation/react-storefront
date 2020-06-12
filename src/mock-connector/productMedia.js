import createMedia from './utils/createMedia'

export default async function productMedia({ id, color }, req, res) {
  return { media: createMedia(id, color) }
}
