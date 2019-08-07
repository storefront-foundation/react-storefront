module.exports = {
  command: 'deploy',
  desc: 'build and deploy your app to the Moovweb XDN',
  builder: yargs => {
    return yargs
      .option('environment', {
        alias: 'e',
        default: 'prod',
        describe:
          'The name of the environment to build, corresponding to a key in the "environments" under "moovweb" in package.json.'
      })
      .demand('account', {
        alias: 'a',
        describe: 'The name of your account in the Moovweb Control Center'
      })
      .demand('project', {
        alias: 'p',
        describe: 'The name of the project in the Moovweb Control Center'
      })
  },
  handler: ({ environment }) => {
    require('../lib/build')(environment)
  }
}
