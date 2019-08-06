const eslintFormatter = require('react-dev-utils/eslintFormatter')
const path = require('path')
const webpack = require('webpack')
const buildTimestamp = new Date().getTime().toString()

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
      test: /\.(png|jpg|gif|otf|woff|ttf)$/,
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
    {
      test: /\.svg$/,
      use: [{ loader: 'babel-loader', options: { envName } }, { loader: 'react-svg-loader' }]
    },
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

module.exports = {
  createAliases,
  createLoaders,
  injectBuildTimestamp
}
