const path = require('path');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin')
const StatsWriterPlugin = require("webpack-stats-plugin").StatsWriterPlugin
const OpenBrowserPlugin = require('open-browser-webpack-plugin')
const WriteFilePlugin = require('write-file-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const { GenerateSW } = require('workbox-webpack-plugin');
const { createClientConfig, createLoaders, createPlugins} = require('./common')
const hash = require('md5-file').sync

function createServiceWorkerPlugins({ root, dest, workboxConfig }) {
  const swBootstrap = path.join(__dirname, '..', 'service-worker', 'bootstrap.js')
  const swHash = hash(path.join(swBootstrap))
  const swBootstrapDest = `serviceWorkerBootstrap.${swHash}.js`

  if (workboxConfig) {
    return [
      new CopyPlugin([{
        from: swBootstrap,
        to: path.join(root, 'build', 'assets', 'pwa', swBootstrapDest),
        transform: (content) => content.toString().replace('{{version}}', new Date().getTime())
      }]),
      new GenerateSW(Object.assign({
        swDest: path.join(dest, '..', 'service-worker.js'),
        importScripts: [ `/pwa/${swBootstrapDest}` ],
        clientsClaim: true,
        skipWaiting: true
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
  * @param {Object} entries Additional entries for adapt components
   * @return {Object} A webpack config
   */
  dev(root, { workboxConfig, entries } = {}) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const url = 'http://localhost:8080'
    const dest = path.join(root, 'build', 'assets', 'pwa')

    return () => Object.assign(createClientConfig(root, { entries }), {
      devtool: 'inline-cheap-module-source-map',
      module: {
        rules: createLoaders(path.resolve(root, 'src'), { eslintConfig: './eslint-client' })
      },
      plugins: [
        ...createPlugins(root),
        new webpack.DefinePlugin({
          'process.env.MOOV_RUNTIME': JSON.stringify('client'),
          'process.env.MOOV_SW': JSON.stringify(process.env.MOOV_SW)
        }),
        new OpenBrowserPlugin({ url }),
        new WriteFilePlugin(),
        new CopyPlugin([{
          from: path.join(root, 'public'),
          to: path.join(root, 'build', 'assets')
        }]),
        new StatsWriterPlugin({
          filename: 'stats.json'
        }),
        ...createServiceWorkerPlugins({ root, dest, workboxConfig: process.env.MOOV_SW ? workboxConfig : null })
      ]
    })
  },

  /**
   * Generates a webpack config for the client production build
   * @param {String} root The path to the root of the project
   * @param {Object} workboxConfig A config object for InjectManifest from workbox-webpack-plugin.  See https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin#configuration
   * @return {Object} A webpack config
   */
  prod(root, { workboxConfig = {}, entries } = {}) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    const dest = path.join(root, 'build', 'assets', 'pwa')
    const swBootstrap = path.join(__dirname, '..', 'service-worker', 'bootstrap.js')
    const swHash = hash(path.join(swBootstrap))
    const swBootstrapDest = `serviceWorkerBootstrap.${swHash}.js`

    return Object.assign(createClientConfig(root, { entries }), {
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
        ...createServiceWorkerPlugins({ root, dest, workboxConfig })
      ].concat(createPlugins(root))
    });
  }

}
