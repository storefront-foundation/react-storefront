module.exports = {
  clearMocks: true,
  testEnvironment: './test/config/jsdom',
  setupFiles: ['./test/config/setup.js'],
  setupFilesAfterEnv: ['./test/config/mocks.js', './node_modules/jest-enzyme/lib/index.js'],
  collectCoverage: true,
  collectCoverageFrom: [
    './src/**/*.{js,jsx}',
    './service-worker/*.{js,jsx}',
    '!./src/plugins/*',
    '!**/index.js',
  ],
  moduleNameMapper: {
    'react-storefront/(.*)': '<rootDir>/src/$1',
  },
  transform: {
    '.*': './test/config/babelTransformer.js',
  },
  transformIgnorePatterns: [
    'node_modules/(?!(workbox-expiration|workbox-core|workbox-routing|workbox-strategies|workbox-precaching)/)',
  ],
}
