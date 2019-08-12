const path = require('path')
const { createLoaders, injectBuildTimestamp, createAliases } = require('./common')
const AliasRegexOverridePlugin = require('alias-regex-webpack-plugin')

module.exports = {
  /**
   * Generates a webpack config for the server development build
   * @param {String} root The path to the root of the project
   * @param {Object} options
   * @param {Object} options.eslintConfig A config object for eslint
   * @param {Object} options.rules Additional rules to add the webpack config
   * @param {Object} options.envVariables Environment variables to inject into the build
   * @param {Object} options.alias Aliases to apply to the webpack config
   * @return {Function} A function that returns a webpack config
   */
  dev(
    root,
    { eslintConfig = require('./eslint-server'), envVariables = {}, rules = [], alias = {} } = {}
  ) {
    return () =>
      createConfig({
        root,
        alias,
        statsModule: 'getStatsInDev',
        eslintConfig,
        rules,
        mode: 'development',
        devtool: 'cheap-module-source-map',
        plugins: createPlugins(root, 'development', envVariables)
      })
  },

  /**
   * Generates a webpack config for the server production build
   * @param {String} root The path to the root of the project
   * @param {Object} options.eslintConfig A config object for eslint
   * @param {Object} options.rules Additional rules to add the webpack config
   * @param {Object} options.envVariables Environment variables to inject into the build
   * @param {Object} options.alias Aliases to apply to the webpack config
   * @return {Function} A function that returns a webpack config
   */
  prod(
    root,
    { eslintConfig = require('./eslint-server'), envVariables = {}, rules = [], alias = {} } = {}
  ) {
    return () =>
      createConfig({
        root,
        alias,
        statsModule: 'getStats',
        eslintConfig,
        rules,
        mode: 'development',
        devtool: 'source-map',
        plugins: createPlugins(root, 'production', envVariables)
      })
  }
}

/**
 * Shared function for creating a server webpack config
 */
function createConfig({ root, alias, statsModule, eslintConfig, rules, ...others }) {
  const rsfPath = path.join(root, 'node_modules', 'react-storefront')

  return {
    entry: path.join('..', 'scripts', 'mount.js'),
    name: 'server',
    context: path.join(root, 'src'),
    output: {
      devtoolModuleFilenameTemplate: '[absolute-resource-path]',
      filename: path.join('..', 'scripts', 'moov_main.js'),
      globalObject: 'global' // this is needed for the `window is not defined` JSONP related error
    },
    node: {
      // Fixes the `Cannot find module 'fs'` error when using clean-css in Server.js
      fs: 'empty'
    },
    target: 'web',
    module: {
      rules: createLoaders(root, {
        envName: 'development-server',
        assetsPath: '../build/assets/pwa',
        eslintConfig,
        additionalRules: rules
      })
    },
    resolve: {
      alias: {
        ...createAliases(root),
        ...alias,
        'react-storefront-stats': path.join(rsfPath, 'stats', statsModule),
        fetch: path.join(rsfPath, 'fetch'),
        'cross-fetch': path.join(rsfPath, 'fetch.common')
      }
    },
    ...others
  }
}

function createPlugins(root, env, envVariables) {
  const webpack = require(path.join(root, 'node_modules', 'webpack'))

  return [
    injectBuildTimestamp(),
    new AliasRegexOverridePlugin(/^\//, `${path.resolve(path.join(root, 'scripts'))}${path.sep}`),
    new webpack.ExtendedAPIPlugin(),
    new webpack.optimize.LimitChunkCountPlugin({
      maxChunks: 1
    }),
    new webpack.DefinePlugin({
      'process.env.MOOV_RUNTIME': JSON.stringify('server'),
      'process.env.MOOV_ENV': JSON.stringify(env),
      ...envVariables
    })
  ]
}
