import { join } from 'path'

describe('listRoutes', () => {
  let originalDir, listRoutes

  beforeEach(() => {
    jest.isolateModules(() => {
      originalDir = process.cwd()
      process.chdir(join(__dirname, 'test-app'))
      listRoutes = require('../../src/server/listRoutes').default
    })
  })

  afterEach(() => {
    process.chdir(originalDir)
  })

  describe('development', () => {
    it('should return routes in development', () => {
      expect(listRoutes()).toEqual({
        '^\\/p\\/([^/]+?)(?:\\/)?$': {
          as: '/p/[productId]',
          component: 'pages/p/[productId].js',
        },
      })
    })
  })

  describe('production', () => {
    let nodeEnv

    beforeEach(() => {
      nodeEnv = process.env.NODE_ENV
      process.env.NODE_ENV = 'production'
    })

    afterEach(() => {
      process.env.NODE_ENV = nodeEnv
    })

    it('should return routes in production', () => {
      expect(listRoutes()).toEqual({
        '^\\/p\\/([^/]+?)(?:\\/)?$': {
          as: '/p/[productId]',
          component: 'pages/p/[productId].js',
        },
      })
    })
  })
})
