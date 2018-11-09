const path = require('path')
const { createServerConfig, createLoaders } = require('./common')
const { merge } = require('lodash')

module.exports = {

  /**
   * Generates a webpack config for the server development build
   * @param {String} root The path to the root of the project
   * @return {Object} A webpack config
   */
  dev(root) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))
    
    const alias = {
      'react-storefront-stats': path.join(root, 'node_modules', 'react-storefront', 'src', 'stats', 'getStatsInDev')
    }

    return ({ entry, plugins, output, target, resolve }) => merge(createServerConfig(root, alias), {
      entry, 
      output: merge(output,
        {
          devtoolModuleFilenameTemplate: '[absolute-resource-path]'
        }
      ),
      target,
      resolve,
      module: {
        rules: createLoaders(root, { modules: 'commonjs', plugins: [ 'react-storefront' ], assetsPath: '../build/assets/pwa', eslintConfig: './eslint-server' })
      },
      devtool: 'cheap-module-source-map',
      plugins: [
        ...plugins,
        new webpack.ExtendedAPIPlugin(),
        new webpack.DefinePlugin({
          'process.env.MOOV_RUNTIME': JSON.stringify('server'),
          'process.env.MOOV_ENV': JSON.stringify('development')
        })
      ]
    })
  },

  /**
   * Generates a webpack config for the server production build
   * @param {String} root The path to the root of the project
   * @return {Object} A webpack config
   */
  prod(root) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))

    const alias = {
      'react-storefront-stats': path.join(root, 'node_modules', 'react-storefront', 'src', 'stats', 'getStats')
    }

    return ({ entry, plugins, output, target, resolve }) => merge(createServerConfig(root, alias), {
      entry, 
      output,
      target,
      resolve,
      module: {
        rules: createLoaders(root, { modules: 'commonjs', plugins: [ 'react-storefront' ], eslintConfig: './eslint-server' })
      },
      plugins: [
        ...plugins,
        new webpack.ExtendedAPIPlugin(),
        new webpack.optimize.LimitChunkCountPlugin({
          maxChunks: 1
        }),
        new webpack.DefinePlugin({
          'process.env.MOOV_RUNTIME': JSON.stringify('server'),
          'process.env.MOOV_ENV': JSON.stringify('production')
        })
      ]
    })
  }

}
