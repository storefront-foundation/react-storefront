const eslintFormatter = require('react-dev-utils/eslintFormatter')
const path = require('path')
const webpack = require('webpack')
const buildTimestamp = new Date().getTime().toString()

function createClientConfig(
  root,
  {
    // This is where the developer will add additional entries for adapt components.
    entries = {},
    alias = {}
  }
) {
  return {
    name: 'client',
    target: 'web',
    context: path.join(root, 'src'),
    entry: Object.assign(
      {
        main: ['./client.js'],
        installServiceWorker: path.join(
          root,
          'node_modules',
          'react-storefront',
          'amp',
          'installServiceWorker'
        )
      },
      entries
    ),
    resolve: {
      alias: Object.assign({}, createAliases(root), alias, {
        fetch: 'isomorphic-unfetch'
      })
    },
    output: {
      filename: '[name].[hash].js',
      chunkFilename: '[name].[hash].js',
      path: path.join(root, 'build', 'assets', 'pwa'),
      publicPath: '/pwa/',
      devtoolModuleFilenameTemplate: '[absolute-resource-path]'
    }
  }
}

function createServerConfig(root, alias) {
  return {
    name: 'server',
    context: path.join(root, 'src'),
    node: {
      fs: 'empty' // Fixes the `Cannot find module 'fs'` error when using clean-css in Server.js
    },
    resolve: {
      alias: Object.assign({}, createAliases(root), alias, {
        'node-fetch': path.join(root, 'node_modules', 'react-storefront-moov-xdn', 'fetch.common'),
        fetch: path.join(root, 'node_modules', 'react-storefront-moov-xdn', 'fetch'),
        'cross-fetch': path.join(root, 'node_modules', 'react-storefront-moov-xdn', 'fetch.common')
      })
    }
  }
}

function createLoaders(sourcePath, { envName, assetsPath = '.', eslintConfig } = {}) {
  return [
    {
      test: /\.js$/,
      enforce: 'pre',
      include: sourcePath,
      use: [
        {
          loader: 'eslint-loader',
          options: {
            formatter: eslintFormatter,
            eslintPath: require.resolve('eslint'),
            baseConfig: eslintConfig
          }
        }
      ]
    },
    {
      test: /\.js$/,
      enforce: 'pre',
      include: /(src|node_modules\/react-storefront)/,
      use: [
        {
          loader: 'source-map-loader'
        }
      ]
    },
    {
      test: /\.css$/,
      use: ['style-loader', 'css-loader']
    },
    {
      test: /\.js$/,
      include: /(src|node_modules\/proxy-polyfill)/,
      use: [{ loader: 'babel-loader', options: { envName } }]
    },
    {
      test: /\.(png|jpg|gif|otf|woff2?|ttf)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            // having a limit here is critical to keeping css size below amp's limits.
            // when an asset is larger than this limit in bytes, webpack falls back to using
            // file-loader
            limit: 8192,
            fallback: 'file-loader',
            outputPath: assetsPath,
            publicPath: '/pwa'
          }
        }
      ]
    },
    createBabelLoader(envName),
    {
      test: /\.(md|html)$/,
      use: 'raw-loader'
    }
  ]
}

function injectBuildTimestamp() {
  return new webpack.DefinePlugin({
    __build_timestamp__: JSON.stringify(buildTimestamp)
  })
}

function createAliases(root) {
  return {
    mobx: path.join(root, 'node_modules', 'mobx'),
    lodash: path.join(root, 'node_modules', 'lodash'),
    react: path.join(root, 'node_modules', 'react'),
    'react-dom': path.join(root, 'node_modules', 'react-dom'),
    'react-helmet': path.join(root, 'node_modules', 'react-helmet'),
    '@material-ui/core': path.join(root, 'node_modules', '@material-ui/core'),
    'react-universal-component': path.join(root, 'node_modules', 'react-universal-component'),
    'react-transition-group': path.join(root, 'node_modules', 'react-transition-group')
  }
}

function createBabelLoader(envName) {
  return {
    test: /\.svg$/,
    use: [{ loader: 'babel-loader', options: { envName } }, { loader: 'react-svg-loader' }]
  }
}

module.exports = {
  createClientConfig,
  createServerConfig,
  createLoaders,
  createBabelLoader,
  createAliases,
  injectBuildTimestamp
}
