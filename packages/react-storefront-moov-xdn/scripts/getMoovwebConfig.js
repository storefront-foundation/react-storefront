const fs = require('fs')
const path = require('path')
const merge = require('lodash/merge')

module.exports = function getMoovwebConfig() {
  const packageJson = path.join(process.cwd(), 'package.json')
  const contents = fs.readFileSync(packageJson, 'utf8')

  return merge(
    {
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
    },
    JSON.parse(contents).moovweb
  )[process.env.NODE_ENV || 'development']
}
