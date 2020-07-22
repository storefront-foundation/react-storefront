export default [
  { source: '/', destination: '/' },
  { source: '/s/:subcategoryId', destination: '/s/[subcategoryId]' },
  { source: '/p/:productId', destination: '/p/[productId]' },
  { source: '/p/:productId/suggestions', destination: '/p/[productId]/suggestions' },
]
