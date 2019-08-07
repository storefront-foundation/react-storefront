#!/usr/bin/env node

require('yargs')
  .commandDir('commands')
  .demandCommand()
  .help().argv
