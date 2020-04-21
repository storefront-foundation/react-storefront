const webpack = require('webpack')
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const ClearRequireCachePlugin = require('webpack-clear-require-cache-plugin')

/**
 * Creates a Next config for running react storefront.  In addition to the standard Next.js options,
 * this function accepts the following:
 *
 * `usePreact` - Set to `true` to use Preact instead of React.
 *  Values are automatically wrapped in JSON.stringify, so you do not need to do this yourself.
 * `swSrc` - The path to your service worker source file. Defaults to sw/service-worker.js in the root of your project.
 */
module.exports = (nextConfig = {}) => {
  const usePreact = process.env.preact === 'true'

  return {
    ...nextConfig,
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

      if (process.env.NODE_ENV === 'development') {
        // This makes it easier to develop apps against a local clone of react-storefront linked with yalc. Here
        // we ensure that the server build recompiles when any linked dependency changes.
        config.plugins.push(
          new ClearRequireCachePlugin([
            /\.next\/server\/ssr-module-cache.js/,
            /react-storefront.*/,
            /@xdn.*/,
          ]),
        )
      }

      config.plugins.push(
        new webpack.DefinePlugin({
          'process.env.RSF_APP_VERSION': JSON.stringify(new Date().getTime().toString()),
        }),
      )

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
      return {
        ...config,
        watchOptions: {
          ignored: [], // required to recompile client build when there are changes in node_modules
        },
      }
    },
  }
}
