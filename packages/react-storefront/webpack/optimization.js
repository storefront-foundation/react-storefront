const merge = require('lodash/merge')
const TerserPlugin = require('terser-webpack-plugin')

/**
 * Creates the webpack optimization config for production and development builds.
 * @param {Object} options
 * @param {Boolean} options.production The production 
 * @param {Object} options.overrides Overrides to be applied to the returned config
 * @return {Object}
 */
module.exports = function createOptimization({ production = false, overrides = {} } = {}) {

  const optimization = {}

  if (production) {
    optimization.minimize = true
    optimization.minimizer = [
      new TerserPlugin({
        terserOptions: {
          warnings: false,
          ie8: false,
          compress: {
            comparisons: false
          },
          parse: {},
          mangle: true,
          output: {
            comments: false,
            ascii_only: true
          }
        },
        parallel: true,
        cache: true,
        sourceMap: true
      })
    ]
  }

  return merge(optimization, overrides)

}