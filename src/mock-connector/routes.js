export default [
  { source: '/', page: '/' },
  { source: '/s/:subcategoryId', destination: '/s/[subcategoryId]' },
  { source: '/p/:productId', destination: '/p/[productId]' },
  { source: '/products/:productId', destination: '/p/[productId]' },
  { source: '/p/:productId/suggestions', destination: '/p/[productId]/suggestions' },
  { source: '/foo', destination: '/' },
]
