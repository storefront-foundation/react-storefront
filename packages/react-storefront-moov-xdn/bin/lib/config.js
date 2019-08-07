const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')
const getEnvironment = require('./getEnvironment')

function getConfig(environment = getEnvironment(), { write = false } = {}) {
  const packageJson = path.join(process.cwd(), 'package.json')
  const contents = fs.readFileSync(packageJson, 'utf8')
  let { environments, ...config } = merge(
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

  config = merge(config, environments[environment] || {})

  if (write) {
    fs.writeFileSync(
      path.join(process.cwd(), 'moov_config.json'),
      JSON.stringify(config, null, '  '),
      'utf8'
    )
  }

  return config
}

module.exports = {
  getConfig
}
