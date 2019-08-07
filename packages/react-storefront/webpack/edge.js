const path = require('path')
const { createAliases, createBabelLoader } = require('./common')
const OEMConfigWriterPlugin = require('./plugins/oem-config-writer-plugin')

module.exports = function prod(
  root,
  { router = 'src/routes.js', alias = {}, envVariables = {} } = {}
) {
  const webpack = require(path.join(root, 'node_modules', 'webpack'))

  return () => ({
    name: 'edge',
    entry: path.join(root, router),
    context: root,
    output: {
      filename: 'routes.js',
      path: path.join(root),
      globalObject: 'global', // this is needed for the `window is not defined` JSONP related error
      libraryTarget: 'commonjs2'
    },
    target: 'web',
    module: {
      rules: [createBabelLoader('server')]
    },
    resolve: {
      alias: {
        ...createAliases(root),
        ...alias
      }
    },
    plugins: [
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1
      }),
      new webpack.DefinePlugin({
        'process.env.MOOV_RUNTIME': JSON.stringify('server'),
        'process.env.MOOV_ENV': JSON.stringify('prod'),
        ...envVariables
      }),
      new OEMConfigWriterPlugin({
        outputFile: path.join('build', 'oem.json')
      })
    ]
  })
}
