const path = require('path')
const {
  createServerConfig,
  createLoaders,
  optimization,
  injectBuildTimestamp
} = require('./common')
const merge = require('lodash/merge')
const FilterWarningsPlugin = require('webpack-filter-warnings-plugin')

const ampOptimizerErrorSupression = new FilterWarningsPlugin({
  exclude: /Critical dependency: the request of a dependency is an expression/
})

module.exports = {
  /**
   * Generates a webpack config for the server development build
   * @param {String} root The path to the root of the project
   * @return {Object} A webpack config
   * @param {Object} options
   * @param {Object} options.eslintConfig A config object for eslint
   * @param {Object} options.additionalRules Additional rules to add the webpack config
   * @param {Object} options.envVariables Environment variables to inject into the build
   * @param {Object} options.alias Aliases to apply to the webpack config
   */
  dev(
    root,
    { eslintConfig = require('./eslint-server'), envVariables = {}, rules = [], alias = {} } = {}
  ) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))

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

    return ({ entry, plugins, output, target, resolve }) =>
      merge(createServerConfig(root, alias), {
        entry,
        mode: 'development',
        output: merge(output, {
          devtoolModuleFilenameTemplate: '[absolute-resource-path]'
        }),
        target,
        resolve,
        module: {
          rules: createLoaders(root, {
            envName: 'development-server',
            assetsPath: '../build/assets/pwa',
            eslintConfig,
            additionalRules: rules
          })
        },
        devtool: 'cheap-module-source-map',
        plugins: [
          ...plugins,
          injectBuildTimestamp(),
          new webpack.ExtendedAPIPlugin(),
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
          }),
          new webpack.DefinePlugin({
            'process.env.MOOV_RUNTIME': JSON.stringify('server'),
            'process.env.MOOV_ENV': JSON.stringify('development'),
            ...envVariables
          }),
          ampOptimizerErrorSupression
        ]
      })
  },

  /**
   * Generates a webpack config for the server production build
   * @param {String} root The path to the root of the project
   * @param {Object} options
   * @param {Object} options.envVariables Environment variables to inject into the build
   * @param {Object} options.alias Aliases to apply to the webpack config
   * @return {Object} A webpack config
   */
  prod(root, { envVariables = {}, alias = {} } = {}) {
    const webpack = require(path.join(root, 'node_modules', 'webpack'))

    alias = {
      ...alias,
      'react-storefront-stats': path.join(
        root,
        'node_modules',
        'react-storefront',
        'stats',
        'getStats'
      )
    }

    return ({ entry, plugins, output, target, resolve }) =>
      merge(createServerConfig(root, alias), {
        entry,
        output,
        target,
        resolve,
        mode: 'production',
        devtool: 'source-map',
        optimization,
        module: {
          rules: createLoaders(root, {
            envName: 'production-server',
            eslintConfig: './eslint-server'
          })
        },
        plugins: [
          ...plugins,
          injectBuildTimestamp(),
          new webpack.ExtendedAPIPlugin(),
          new webpack.optimize.LimitChunkCountPlugin({
            maxChunks: 1
          }),
          new webpack.DefinePlugin({
            'process.env.MOOV_RUNTIME': JSON.stringify('server'),
            'process.env.MOOV_ENV': JSON.stringify('production'),
            ...envVariables
          }),
          ampOptimizerErrorSupression
        ]
      })
  }
}
