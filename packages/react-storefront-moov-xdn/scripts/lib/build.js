#!/usr/bin/env node

const { getConfig } = require('./config')
const webpack = require('webpack')
const { clear, log } = console
const { emojify } = require('node-emoji')
const { blue, bold, green, red } = require('chalk')
const path = require('path')

module.exports = async function build(environment) {
  clear()

  log(
    blue(
      bold(
        emojify(
          `:hammer_and_wrench:  Building React Storefront app for the Moovweb XDN (using ${green(
            process.env.NODE_ENV
          )} webpack configs)...\n`
        )
      )
    )
  )

  const config = getConfig(environment)

  // build server last because it needs the client stats
  const sorted = Object.keys(config.builds).sort((a, b) => (a === 'server' ? 1 : 0))

  for (let key of sorted) {
    try {
      const build = config.builds[key]
      process.stdout.write(green(bold(emojify(`Building ${key} bundle... `))))
      const compiler = webpack(require(path.resolve(build))())
      await run(compiler)
      process.stdout.write(green(bold(emojify('success! :tada:\n\n'))))
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
