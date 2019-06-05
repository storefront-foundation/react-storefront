const webpack = require('webpack')
const path = require('path')
const StatsWriterPlugin = require('webpack-stats-plugin').StatsWriterPlugin
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin')
const { createClientConfig, createLoaders, injectBuildTimestamp } = require('./common')
const createOptimization = require('./optimization')
const hash = require('md5-file').sync
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')

function createServiceWorkerPlugins({
  root,
  dest,
  workboxConfig,
  prefetchRampUpTime,
  allowPrefetchThrottling = false,
  serveSSRFromCache = false
}) {
  const swBootstrap = path.join(__dirname, '..', 'service-worker', 'bootstrap.js')
  const swHash = hash(path.join(swBootstrap))
  const swBootstrapDest = `serviceWorkerBootstrap.${swHash}.js`

  if (workboxConfig) {
    return [
      new CopyPlugin([
        {
          from: swBootstrap,
          to: path.join(root, 'build', 'assets', 'pwa', swBootstrapDest),
          transform: content => {
            const buildTime = new Date().getTime() + 5 * 1000 * 60 // add 5 minutes to give the build time to deploy

            return content
              .toString()
              .replace('{{version}}', buildTime)
              .replace('{{deployTime}}', buildTime)
              .replace('{{prefetchRampUpTime}}', prefetchRampUpTime)
              .replace('{{allowPrefetchThrottling}}', allowPrefetchThrottling)
              .replace('{{serveSSRFromCache}}', serveSSRFromCache)
          }
        }
      ]),
      new GenerateSW(
        Object.assign(
          {
            swDest: path.join(dest, '..', 'service-worker.js'),
            importScripts: [`/pwa/${swBootstrapDest}`],
            clientsClaim: true,
            skipWaiting: true,
            exclude: [/stats\.json/, /\.DS_Store/, /robots\.txt/, /manifest\.json/, /icons\//]
          },
          workboxConfig
        )
      )
    ]
  } else {
    return []
  }
}

module.exports = {
  /**
   * Generates a webpack config for the client development build
   * @param {String} root The path to the root of the project
   * @param {Object} options
   * @param {Object} options.entries Additional entries for adapt components
   * @param {Array}  options.additionalPlugins Additional plugins
   * @param {Object} options.workboxConfig A config object for InjectManifest from workbox-webpack-plugin.  See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration
   * @param {Number} options.prefetchRampUpTime The number of milliseconds from the time of the build before prefetching is ramped up to 100%
   * @param {Boolean} options.allowPrefetchThrottling Set to true allow the platform to return a 544 error when a prefetch request results in a cache miss
   * @param {Object} options.eslintConfig A config object for eslint
   * @param {Boolean} options.optimization Configuration for the webpack optimzation object
   * @param {Object} options.alias Aliases to apply to the webpack config
   * @return {Object} A webpack config
   */
  dev(
    root,
    {
      workboxConfig,
      entries,
      additionalPlugins = [],
      eslintConfig = require('./eslint-client'),
      prefetchRampUpTime = -5000, // compensate for the 5 minute buffer for deployments so that there is no ramp up time
      allowPrefetchThrottling = false,
      serveSSRFromCache = false,
      optimization,
      alias = {}
    } = {}
  ) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const dest = path.join(root, 'build', 'assets', 'pwa')

    alias = {
      ...alias,
      'react-storefront-stats': path.join(
        root,
        'node_modules',
        'react-storefront',
        'stats',
        'getStatsInDev'
      )
    }

    const openBrowser = (process.env.OPEN_BROWSER || 'true').toLowerCase() === 'true'

    return ({ url = 'http://localhost:8080' } = {}) =>
      Object.assign(createClientConfig(root, { entries, alias }), {
        devtool: 'inline-cheap-module-source-map',
        mode: 'development',
        optimization: createOptimization({ overrides: optimization }),
        module: {
          rules: createLoaders(path.resolve(root, 'src'), {
            envName: 'development-client',
            eslintConfig
          })
        },
        plugins: [
          ...createPlugins(root),
          new webpack.DefinePlugin({
            'process.env.MOOV_RUNTIME': JSON.stringify('client'),
            'process.env.MOOV_ENV': JSON.stringify('development'),
            'process.env.MOOV_SW': JSON.stringify(process.env.MOOV_SW)
          }),
          ...(openBrowser ? [new OpenBrowserPlugin({ url, ignoreErrors: true })] : []),
          new WriteFilePlugin(),
          new CopyPlugin([
            {
              from: path.join(root, 'public'),
              to: path.join(root, 'build', 'assets')
            }
          ]),
          new StatsWriterPlugin({
            filename: 'stats.json'
          }),
          ...additionalPlugins,
          ...createServiceWorkerPlugins({
            root,
            dest,
            workboxConfig: process.env.MOOV_SW ? workboxConfig : null,
            prefetchRampUpTime,
            allowPrefetchThrottling,
            serveSSRFromCache
          })
        ]
      })
  },

  /**
   * Generates a webpack config for the client production build
   * @param {String} root The path to the root of the project
   * @param {Object} options
   * @param {Object} options.entries Additional entries for adapt components
   * @param {Array}  options.additionalPlugins Additional plugins
   * @param {Object} options.workboxConfig A config object for InjectManifest from workbox-webpack-plugin.  See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration
   * @param {Number} options.prefetchRampUpTime The number of milliseconds from the time of the build before prefetching is ramped up to 100%
   * @param {Boolean} options.allowPrefetchThrottling Set to true allow the platform to return a 544 error when a prefetch request results in a cache miss
   * @param {Boolean} options.optimization Configuration for the webpack optimzation object
   * @param {Object} options.alias Aliases to apply to the webpack config
   * @return {Object} A webpack config
   */
  prod(
    root,
    {
      workboxConfig = {},
      additionalPlugins = [],
      entries,
      prefetchRampUpTime = 1000 * 60 * 20 /* 20 minutes */,
      allowPrefetchThrottling = true,
      serveSSRFromCache = false,
      optimization,
      alias = {}
    } = {}
  ) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const dest = path.join(root, 'build', 'assets', 'pwa')

    alias = {
      ...alias,
      'react-storefront-stats': path.join(
        root,
        'node_modules',
        'react-storefront',
        'stats',
        'getStatsInDev'
      )
    }

    if (process.env.ANALYZE === 'true') {
      additionalPlugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'static'
        })
      )
    }

    return Object.assign(createClientConfig(root, { entries, alias }), {
      mode: 'production',
      optimization: createOptimization({ production: true, overrides: optimization }),
      module: {
        rules: createLoaders(path.resolve(root, 'src'), { envName: 'production-client' })
      },
      plugins: [
        new webpack.LoaderOptionsPlugin({
          minimize: true,
          debug: false
        }),
        new webpack.DefinePlugin({
          'process.env.MOOV_RUNTIME': JSON.stringify('client'),
          'process.env.NODE_ENV': JSON.stringify('production'),
          'process.env.MOOV_ENV': JSON.stringify('production'),
          'process.env.PUBLIC_URL': JSON.stringify('') // needed for registerServiceWorker.js
        }),
        new StatsWriterPlugin({
          filename: path.relative(dest, path.join(root, 'scripts', 'build', 'stats.json'))
        }),
        new CopyPlugin([
          {
            from: path.join(root, 'public'),
            to: path.join(root, 'build', 'assets')
          }
        ]),
        // new webpack.IgnorePlugin(/Amp/),
        ...additionalPlugins,
        ...createServiceWorkerPlugins({
          root,
          dest,
          workboxConfig,
          prefetchRampUpTime,
          allowPrefetchThrottling,
          serveSSRFromCache
        })
      ].concat(createPlugins(root))
    })
  }
}

function createPlugins(root) {
  return [
    injectBuildTimestamp(),
    new CleanWebpackPlugin(
      [path.join(root, 'build', 'assets'), path.join(root, 'scripts', 'build')],
      {
        allowExternal: true,
        verbose: false
      }
    ),
    new HtmlWebpackPlugin({
      filename: 'install-service-worker.html',
      title: 'Installing Service Worker...',
      chunks: ['bootstrap', 'installServiceWorker']
    })
  ]
}
