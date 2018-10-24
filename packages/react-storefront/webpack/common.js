const eslintFormatter = require('react-dev-utils/eslintFormatter')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin');
const { merge } = require('lodash')
const path = require('path')
const webpack = require('webpack')

function createClientConfig(
  root,
  {
    // This is where the developer will add additional entries for adapt components.
    entries = {}
  }
) {
  return {
    name: 'client',
    target: 'web',
    context: path.join(root, 'src'),
    entry: Object.assign({ 
      main: ['./client.js'],
      installServiceWorker: path.join(root, 'node_modules', 'react-storefront', 'src', 'amp', 'installServiceWorker')
    }, entries),
    resolve: {
      alias: Object.assign({}, createAliases(root), {
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
  return merge({
    name: 'server',
    context: path.join(root, 'src'),
    resolve: {
      alias: Object.assign({}, createAliases(root), alias, {
        fetch: path.join(root, 'node_modules', 'react-storefront', 'src', 'fetch'),
      })
    }
  })
}

function createLoaders(sourcePath, { modules=false, plugins=[], assetsPath='.', eslintConfig }) {
  const babelLoader = {
    loader: 'babel-loader',
    options: {
      cacheDirectory: true,
      presets: [
        ["env", {
          targets: {
            browsers: "> 1%",
            uglify: true
          },
          useBuiltIns: true,
          modules
        }],
        "react"
      ],
      env: {
        "production": {
          "presets": ["minify"]
        }
      },
      plugins: [
        ...plugins,
        ["transform-runtime", {
          "polyfill": false,
          "regenerator": true
        }],
        "transform-async-to-generator",
        "transform-decorators-legacy",
        "syntax-dynamic-import",
        "transform-object-rest-spread",
        "transform-class-properties",
        "universal-import"
      ]
    }
  }

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
            configFile: require.resolve(eslintConfig)
          }
        }
      ]
    },
    {
      test: /\.js$/,
      include: /(src|node_modules\/react-storefront\/src|node_modules\/react-storefront-extensions\/src)/,
      use: [babelLoader]
    },
    {
      test: /\.(png|jpg|gif|otf|woff)$/,
      use: [
        {
          loader: 'url-loader',
          options: {
            // having a limit here is crtical to keeping css size below amp's limits.
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
      use: [
        babelLoader,
        { loader: "react-svg-loader" }
      ]
    },
    {
      test: /\.(md|html)$/,
      use: 'raw-loader'
    }
  ]
}

function createPlugins(root) {
  return [
    new CleanWebpackPlugin([
      path.join(root, 'build', 'assets'),
      path.join(root, 'scripts', 'build')
    ], { 
      allowExternal: true,
      verbose: false
    }),
    new webpack.optimize.CommonsChunkPlugin({
      names: ['bootstrap'], // needed to put webpack bootstrap code before chunks
      filename: '[name].[hash].js',
      minChunks: Infinity
    }),
    new HtmlWebpackPlugin({
      filename: 'install-service-worker.html',
      title: 'Installing Service Worker...',
      chunks: ['bootstrap', 'installServiceWorker']
    })
  ]
}

function createAliases(root) {
  return {
    "mobx": path.join(root, 'node_modules', 'mobx'),
    "react": path.join(root, 'node_modules', 'react'),
    "react-dom": path.join(root, 'node_modules', 'react-dom'),
    "react-helmet": path.join(root, 'node_modules', 'react-helmet'),
    "@material-ui/core": path.join(root, 'node_modules', '@material-ui/core'),
    "react-storefront": path.join(root, 'node_modules', 'react-storefront', 'src'),
    "react-storefront-extensions": path.join(root, 'node_modules', 'react-storefront-extensions', 'src'),
    "react-universal-component": path.join(root, 'node_modules', 'react-universal-component')
  }
}

module.exports = {
  createClientConfig,
  createServerConfig,
  createPlugins,
  createLoaders
}
