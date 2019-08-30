#!/usr/bin/env node
const _ = require('lodash')
const { createReactStorefront } = require('./lib/create-react-storefront')

const getPackageJsonVersion = () => {
  return require('./package.json').version
}

// yargs has a bug where it cannot properly validate arguments
// that have a hypen in them. So --invalid be flagged by Yargs
// as invalid, but --invalid-arg is allowed with no errors.
// This patch validates all of the -- args against the list
// of valid args.
const patchYargsBug = yargsObject => {
  const validArgs = Object.keys(yargsObject.getOptions().key).concat('help')
  let invalidArgs = []
  process.argv.forEach(function(arg) {
    // If the arg starts with --, it is candidate for the bug
    // So we check the value after the -- against the list of valid args.
    if (_.startsWith(arg, '--')) {
      // Before matching remove any --no, -- or trailing =<value>
      const rootArg = arg
        .replace(/^--/, '')
        .replace(/^no-/, '')
        .replace(/=.*$/, '')
      if (validArgs.indexOf(rootArg) < 0) {
        invalidArgs.push(arg)
      }
    }
  })

  // If any of the -- args proved invalid, abort.
  if (invalidArgs.length) {
    const plural = invalidArgs.length > 1 ? 's' : ''
    const msg = `Unknown argument${plural}: ${invalidArgs.join(', ')}`
    // Note: tried to use yargsObject.getUsageInstance().fail(msg); here
    // but it randomly does nothing. So I am using console.error() instead.
    console.error(msg)
    process.exit(1)
  }
  return yargsObject
}

const argv = require('yargs')
  .version(
    true,
    'Display the create-react-storefront version and exit',
    `create-react-storefront v${getPackageJsonVersion()}`
  )
  .command('$0 <project-name>', 'Create a react-storefront project', yargs => {
    const returnedYargs = yargs
      .positional('project-name', {
        describe: 'A name for the new project',
        type: 'string'
      })
      .option('configure-upstream', {
        describe:
          'Sets the upstream site for synthetic APIs and proxying.  Example: --configure-upstream="https://www.domain.com"',
        default: false,
        type: 'boolean'
      })
      .alias('configure-upstream', 'u')
      .option('branch', {
        describe:
          'Use a specific branch from react-storefront-boilerplate as the app template (defaults to master). Example: --branch=commercial',
        default: 'master',
        type: 'string'
      })
      .alias('branch', 'b')
      .option('yes', {
        describe: 'Run in non-interactive mode, accepting all defaults.',
        default: false,
        type: 'boolean'
      })
      .alias('yes', 'y')
      .help()
      .alias('help', 'h')
      .wrap(yargs.terminalWidth())
      .strict()

    return patchYargsBug(returnedYargs)
  })
  .showHelpOnFail(true).argv

createReactStorefront(argv)
