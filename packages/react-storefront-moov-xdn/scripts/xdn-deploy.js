#!/usr/bin/env node

const build = require('./lib/build')

const { environment, account, project } = require('yargs')
  .option('environment', {
    alias: 'e',
    default: 'prod',
    describe: 'The environment to deploy, corresponding to the '
  })
  .demand('account', {
    alias: 'a',
    describe: 'The name of your account in the Moovweb Control Center'
  })
  .demand('project', {
    alias: 'p',
    describe: 'The name of the project in the Moovweb Control Center'
  }).argv

async function main() {
  await build(environment)
}

main()
