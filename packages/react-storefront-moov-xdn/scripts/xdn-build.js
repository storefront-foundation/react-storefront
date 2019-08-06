#!/usr/bin/env node

const getEnvironment = require('./lib/getEnvironment')

const { environment } = require('yargs').option('environment', {
  alias: 'e',
  default: getEnvironment(),
  describe: 'The environment to deploy, corresponding to the '
})

require('./lib/build')(environment)
