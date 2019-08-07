const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')
const getEnvironment = require('./getEnvironment')

function getConfig(environment = getEnvironment()) {
  const packageJson = path.join(process.cwd(), 'package.json')
  const contents = fs.readFileSync(packageJson, 'utf8')
  const { environments, ...config } = merge(
    {
      environments: {
        development: {
          builds: {
            client: 'config/webpack/webpack.dev.client.js',
            server: 'config/webpack/webpack.dev.server.js'
          }
        },
        production: {
          builds: {
            client: 'config/webpack/webpack.prod.client.js',
            server: 'config/webpack/webpack.prod.server.js'
          }
        }
      }
    },
    JSON.parse(contents).moovweb
  )

  return merge(config, environments[environment] || {})
}

function writeMoovConfig(environment = getEnvironment()) {
  fs.writeFileSync(
    path.join(process.cwd(), 'moov_config.json'),
    JSON.stringify(getConfig(environment), null, '  '),
    'utf8'
  )
}

module.exports = {
  getConfig,
  writeMoovConfig
}
