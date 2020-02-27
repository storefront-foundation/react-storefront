const babelJest = require('babel-jest')
const babelCore = require('babel-core')

module.exports = {
  process(src, filename, ...rest) {
    const transformedSrc = babelJest.process(src, filename, ...rest)
    return babelCore.transform(transformedSrc.code, { plugins: ['rewire'] })
  },
}
