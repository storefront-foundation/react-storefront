const webpack = require('webpack')

module.exports = {
  context: __dirname,
  entry: "../test/router/Router.test.browser.js",
  mode: 'development',

  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /(node_modules)/,
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },

  output: {
    path: __dirname,
    filename: "../dist/test.browser.js"
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env.MOOV_RUNTIME': JSON.stringify('client')
    })
  ]
};
