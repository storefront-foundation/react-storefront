const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin');
const { createClientConfig, createLoaders, createPlugins} = require('./common')
const hash = require('md5-file').sync

const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function createServiceWorkerPlugins({ root, dest, workboxConfig, prefetchRampUpTime }) {
  const swBootstrap = path.join(__dirname, '..', 'service-worker', 'bootstrap.js')
  const swHash = hash(path.join(swBootstrap))
  const swBootstrapDest = `serviceWorkerBootstrap.${swHash}.js`

  if (workboxConfig) {
    return [
      new CopyPlugin([{
        from: swBootstrap,
        to: path.join(root, 'build', 'assets', 'pwa', swBootstrapDest),
        transform: (content) => {
          const buildTime = new Date().getTime() + (5 * 1000 * 60) // add 5 minutes to give the build time to deploy

          return content.toString()
            .replace('{{version}}', buildTime)
            .replace('{{deployTime}}', buildTime)
            .replace('{{prefetchRampUpTime}}', prefetchRampUpTime)
        }
      }]),
      new GenerateSW(Object.assign({
        swDest: path.join(dest, '..', 'service-worker.js'),
        importScripts: [ `/pwa/${swBootstrapDest}` ],
        clientsClaim: true,
        skipWaiting: true,
        exclude: [
          /stats\.json/,
          /\.DS_Store/,
          /robots\.txt/,
          /manifest\.json/,
          /icons\//
        ]
      }, workboxConfig)),
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
   * @param {Object} options.workboxConfig A config object for InjectManifest from workbox-webpack-plugin.  See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration
   * @param {Number} options.prefetchRampUpTime The number of milliseconds from the time of the build before prefetching is ramped up to 100%
   * @param {Object} options.eslintConfig A config object for eslint
   * @return {Object} A webpack config
   */
  dev(root, { workboxConfig, entries, eslintConfig = require('./eslint-client'), prefetchRampUpTime = 1000 * 60 * 20 /* 20 minutes */ } = {}) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const dest = path.join(root, 'build', 'assets', 'pwa')
    
    const alias = {
      'react-storefront-stats': path.join(root, 'node_modules', 'react-storefront', 'stats', 'getStatsInDev')
    }

    return ({ url = 'http://localhost:8080' } = {}) => Object.assign(createClientConfig(root, { entries, alias }), {
      devtool: 'inline-cheap-module-source-map',
      module: {
        rules: createLoaders(path.resolve(root, 'src'), { eslintConfig })
      },
      plugins: [
        ...createPlugins(root),
        new webpack.DefinePlugin({
          'process.env.MOOV_RUNTIME': JSON.stringify('client'),
          'process.env.MOOV_ENV': JSON.stringify('development'),
          'process.env.MOOV_SW': JSON.stringify(process.env.MOOV_SW)
        }),
        new OpenBrowserPlugin({ url, ignoreErrors: true }),
        new WriteFilePlugin(),
        new CopyPlugin([{
          from: path.join(root, 'public'),
          to: path.join(root, 'build', 'assets')
        }]),
        new StatsWriterPlugin({
          filename: 'stats.json'
        }),
        ...createServiceWorkerPlugins({ root, dest, workboxConfig: process.env.MOOV_SW ? workboxConfig : null, prefetchRampUpTime })
      ]
    })
  },

  /**
   * Generates a webpack config for the client production build
   * @param {String} root The path to the root of the project
   * @param {Object} options
   * @param {Object} options.entries Additional entries for adapt components
   * @param {Object} options.workboxConfig A config object for InjectManifest from workbox-webpack-plugin.  See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration
   * @param {Number} options.prefetchRampUpTime The number of milliseconds from the time of the build before prefetching is ramped up to 100%
   * @return {Object} A webpack config
   */
  prod(root, { workboxConfig = {}, entries, prefetchRampUpTime = 1000 * 60 * 20 /* 20 minutes */ } = {}) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const dest = path.join(root, 'build', 'assets', 'pwa')
    const optionalPlugins = []

    const alias = {
      'react-storefront-stats': path.join(root, 'node_modules', 'react-storefront', 'stats', 'getStatsInDev')
    }

    if (process.env.ANALYZE === 'true') {
      optionalPlugins.push(new BundleAnalyzerPlugin())
    }

    return Object.assign(createClientConfig(root, { entries, alias }), {
      module: {
        rules: createLoaders(path.resolve(root, 'src'), { eslintConfig: './eslint-client' })
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
        new UglifyJSPlugin({
          uglifyOptions: {
            compress: {
              warnings: false
            },
            mangle: {
              safari10: true
            },
            output: {
              comments: false
            },
            ie8: false
          }
        }),
        new StatsWriterPlugin({
          filename: path.relative(dest, path.join(root, 'scripts', 'build', 'stats.json'))
        }),
        new CopyPlugin([{
          from: path.join(root, 'public'),
          to: path.join(root, 'build', 'assets')
        }]),
        ...optionalPlugins,
        ...createServiceWorkerPlugins({ root, dest, workboxConfig, prefetchRampUpTime })
      ].concat(createPlugins(root))
    });
  }

}