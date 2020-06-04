import createMedia from './utils/createMedia'

export default function productMedia(req, res) {
  const {
    query: { productId, color },
  } = req

  setTimeout(() => {
    res.setHeader('cache-control', 'no-cache, no-store')

    const media = createMedia(productId, color)

    res.end(
      JSON.stringify({
        media,
      }),
    )
  }, 1000)
}
