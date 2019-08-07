const webpack = require('webpack')
const { blue, bold, green, yellow } = require('chalk')
const path = require('path')
const { clear, log } = console
const { emojify } = require('node-emoji')
const fs = require('fs')
const { fork } = require('child_process')
const tmp = path.join(process.cwd(), 'tmp')
const builds = []
const { getConfig, writeMoovConfig } = require('../lib/config')
const argv = require('yargs').argv
const getAppURL = require('../lib/getAppURL')
const open = require('open')

let buildsInProgress = 0
let initializing = true
let moovsdk
let browserOpened = false

function handler({ environment }) {
  const config = getConfig(environment)

  if (!config) {
    log(
      red(
        bold(
          `Error: No moovweb config found for environment ${
            process.env.NODE_ENV
          }.  Please ensure that your package json has a "moovweb" object with a "${
            process.env.NODE_ENV
          }" key.`
        )
      )
    )
    process.exit(0)
  }

  if (!fs.existsSync(tmp)) {
    fs.mkdirSync(tmp)
  }

  clear()

  log(
    blue(bold(emojify(':hammer_and_wrench:  Building React Storefront app for the Moovweb XDN...')))
  )

  for (let key in config.builds) {
    createCompiler(config.builds[key])
  }

  initializing = false
}

function serve() {
  if (moovsdk) return

  writeMoovConfig()

  // const moovsdkPath = path.join(process.cwd(), 'node_modules', 'moovsdk')
  const moovsdkPath = path.join('/Users/markbrocato/Code/moovworker/sdk/sdk-cli')
  const moovArgs = process.argv.slice(2).filter(arg => !arg.match(/--(debug|inspect)/))

  const nodeArgs = ['debug', 'inspect']
    .filter(arg => argv[arg] != null)
    .map(arg => {
      const value = argv[arg]

      if (value === true) {
        return `--${arg}`
      } else {
        return `--${arg}=${value}`
      }
    })

  moovsdk = fork(moovsdkPath, ['start', '--no-build', '--pause', ...moovArgs], {
    silent: true,
    execArgv: nodeArgs
  })

  moovsdk.stdout.on('data', data => {
    if (buildsInProgress === 0) {
      process.stdout.write(data)
    }

    if (data.includes('MoovJS SDK is running')) {
      openBrowser()
    }
  })

  moovsdk.stderr.on('data', data => {
    if (buildsInProgress === 0) {
      process.stderr.write(data)
    }
  })
}

function createCompiler(config) {
  const build = { errors: false }
  const compiler = webpack(require(path.resolve(config))())

  compiler.plugin('watch-run', (_compiler, callback) => {
    if (!initializing) {
      clear()
      process.stdout.write(blue(bold(emojify(':hammer_and_wrench:  Rebuilding... '))))
    }
    buildStarted()
    callback()
  })

  compiler.watch({}, (err, stats) => reportErrors.bind(build, err, stats))
  compiler.plugin('done', buildEnded)
  builds.push(build)
}

function buildStarted() {
  if (buildsInProgress++ === 0 && moovsdk) {
    moovsdk.send('pause-requests')
  }
}

function buildEnded() {
  if (--buildsInProgress === 0 && moovsdk) {
    moovsdk.send('resume-requests')
  }

  if (!builds.some(b => b.errors) && buildsInProgress === 0) {
    process.stdout.write(green(bold(emojify('Build successful! :tada:\n\n'))))
    serve()
  }
}

function openBrowser() {
  if (process.env.OPEN_BROWSER !== 'false' && !browserOpened) {
    browserOpened = true

    try {
      open(getAppURL(argv))
    } catch (e) {
      console.log('error getting URL for app', e)
    }
  }
}

function reportErrors(build, err, stats) {
  if (err) {
    log(red(`Error in ${key} Webpack configuration.`))
    log(red(err.stack || err.message))

    if (err.details) {
      log(red(err.details))
    }

    return
  }

  const info = stats.toJson()

  if (stats.hasErrors()) {
    build.errors = true
    log(red(bold(emojify('\n:boom:  Error(s) occurred while building your app:\n'))))

    for (let error of Array.from(info.errors)) {
      log(red(error))
    }
    return
  } else {
    build.errors = false
  }

  if (stats.hasWarnings()) {
    for (let warning of Array.from(info.warnings)) {
      log(yellow(warning))
    }
  }
}

module.exports = {
  command: 'dev',
  desc: 'build and serve your app locally',
  builder: yargs => {
    return yargs
      .option('environment', {
        alias: 'e',
        describe:
          'The name of the environment to build, corresponding to a key in the "environments" under "moovweb" in package.json.',
        default: 'development'
      })
      .option('debug', {
        alias: 'd',
        describe: 'Include this flag to listen for debugger connections',
        default: false
      })
      .option('port', {
        alias: 'p',
        describe: 'The port on which to serve the app',
        default: 8080
      })
      .option('service-worker', {
        alias: 'sw',
        describe: 'Set to true to build and serve the service-worker',
        default: false
      })
  },
  handler
}
