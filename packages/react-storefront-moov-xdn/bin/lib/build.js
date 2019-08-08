const { getConfig } = require('./config')
const webpack = require('webpack')
const { clear, log } = console
const { emojify } = require('node-emoji')
const { blue, bold, green, red } = require('chalk')
const path = require('path')

if (!process.env.NODE_ENV) {
  process.env.NODE_ENV = 'production'
}

module.exports = async function build(environment) {
  log(
    blue(
      bold(
        emojify(
          `:hammer_and_wrench:  Building React Storefront app for the Moovweb XDN (` +
            `environment: ${green(environment)}, ` +
            `bundles: ${green(process.env.NODE_ENV)}` +
            `)...\n`
        )
      )
    )
  )

  const config = getConfig(environment, { write: true })

  // build server last because it needs the client stats
  const sorted = Object.keys(config.builds).sort((a, b) => (a === 'client' ? 0 : 1))

  for (let key of sorted) {
    try {
      const build = config.builds[key]
      process.stdout.write(green(bold(emojify(`Building ${key} bundle... `))))
      const compiler = webpack(require(path.resolve(build))())
      await run(compiler)
      process.stdout.write(green(bold(emojify('success! :tada:\n'))))
    } catch (e) {
      log(red(bold(emojify(`\n:boom:  Error(s) occurred in the ${key} build:\n`))))
      log(e)
      process.exit(0)
    }
  }
}

function run(compiler) {
  return new Promise((resolve, reject) => {
    compiler.run(err => {
      if (err) {
        reject(err)
      } else {
        resolve()
      }
    })
  })
}
