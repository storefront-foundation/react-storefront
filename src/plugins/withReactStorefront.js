const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ClearRequireCachePlugin = require('webpack-clear-require-cache-plugin')
const withServiceWorker = require('./withServiceWorker')

/**
 * @param options
 * @param options.prefetchQueryParam If specified, this parameter will be added to the query string of all prefetch requests.
 * @param options.connector The connector package to use.  By default React Storefront's mock connector will be used.
 */
module.exports = ({
  prefetchQueryParam,
  connector = 'react-storefront/mock-connector',
  ...nextConfig
} = {}) => {
  const usePreact = process.env.preact === 'true'

  nextConfig.serverRuntimeConfig = {
    ...nextConfig.serverRuntimeConfig,
    reactStorefront: { connector },
  }

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

      if (options.isServer) {
        console.log(`> Using connector ${connector}`)

        config.resolve.alias = {
          ...config.resolve.alias,
          'react-storefront-connector': connector,
        }
      }

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.RSF_PREFETCH_QUERY_PARAM': JSON.stringify(prefetchQueryParam),
          'process.env.SERVICE_WORKER': JSON.stringify(process.env.SERVICE_WORKER),
        }),
      )

      if (config.externals) {
        // Making sure the AMP optimizer is bundled
        config.externals = config.externals.filter(name => name !== '@ampproject/toolbox-optimizer')
        // These are optional dependencies for the optimizer
        // which are not used by default
        config.externals.push('jimp')
        config.externals.push('probe-image-size')
      }

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
