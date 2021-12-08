import createMedia from './utils/createMedia'

export default async function productMedia({ id, color }) {
  return { media: createMedia(id, color) }
}
