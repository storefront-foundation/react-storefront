const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ClearRequireCachePlugin = require('webpack-clear-require-cache-plugin')
const withServiceWorker = require('./withServiceWorker')

/**
 * @param options
 * @param options.prefetchQueryParam If specified, this parameter will be added to the query string of all prefetch requests.
 */
module.exports = ({ prefetchQueryParam, ...nextConfig } = {}) => {
  const usePreact = process.env.preact === 'true'

  return withServiceWorker({
    ...nextConfig,
    target: 'serverless',
    webpack(config, options) {
      config.resolve.symlinks = false

      if (usePreact) {
        config.resolve.alias = {
          ...config.resolve.alias,
          react: 'preact/compat',
          react$: 'preact/compat',
          'react-dom/test-utils': 'preact/test-utils',
          'react-dom': 'preact/compat',
          'react-dom$': 'preact/compat',
        }
      }

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.PREFETCH_QUERY_PARAM'
        }),
      )

      if (process.env.NODE_ENV === 'development') {
        // This makes it easier to develop apps against a local clone of react-storefront linked with yalc. Here
        // we ensure that the server build recompiles when any linked dependency changes.
        config.plugins.push(
          new ClearRequireCachePlugin([
            /\.next\/server\/ssr-module-cache.js/,
            /react-storefront-analytics/,
            /react-storefront-amp/,
            /react-storefront\//,
          ]),
        )
      }

      config.module.rules.push({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      })

      if (!options.isServer && process.env.analyze === 'true') {
        config.plugins.push(new BundleAnalyzerPlugin())
      }

      if (typeof nextConfig.webpack === 'function') {
        return nextConfig.webpack(config, options)
      }

      return config
    },
    webpackDevMiddleware(config) {
      config.watchOptions = {
        // required to recompile client build when there are changes in node_modules
        ignored: [],
      }
      return config
    },
  })
}
