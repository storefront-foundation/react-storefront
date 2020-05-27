import getRoutes from 'react-storefront/server/getRoutes'

describe('getRoutes', () => {
  const manifest = {
    '/_app': 'static/development/pages/_app.js',
    '/p/[productId]': 'static/development/pages/p/[productId].js',
  }

  it('should return routes', () => {
    const routes = getRoutes(manifest)

    expect(routes).toStrictEqual({
      '^\\/_app(?:\\/)?$': { component: 'static/development/pages/_app.js', as: '/_app' },
      '^\\/p\\/([^/]+?)(?:\\/)?$': {
        component: 'static/development/pages/p/[productId].js',
        as: '/p/[productId]',
      },
    })
  })
})
