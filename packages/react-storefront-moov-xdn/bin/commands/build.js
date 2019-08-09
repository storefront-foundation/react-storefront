module.exports = {
  command: 'build',
  desc: 'build your app for production',
  builder: yargs => {
    return yargs
      .option('environment', {
        alias: 'e',
        describe:
          'The name of the environment to build, corresponding to a key in the "environments" under "moovweb" in package.json.',
        default: process.env.moov_env || 'production'
      })
      .option('analyze', {
        alias: 'a',
        descript: 'Perform a size analysis on the client bundle.'
      })
  },
  handler: ({ environment, analyze }) => {
    if (analyze) {
      process.env.ANALYZE = 'true'
    }

    require('../lib/build')(environment)
  }
}
