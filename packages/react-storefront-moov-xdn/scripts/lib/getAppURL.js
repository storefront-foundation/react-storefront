const path = require('path')

module.exports = function getAppURL(argv) {
  let port = argv['port']
  let hostHack = argv['host-hack']
  let hostname = 'localhost'

  if (port == null) {
    port = hostHack ? '' : `:8080`
  } else {
    port = `:${port}`
  }

  if (hostHack) {
    const config = require(path.join(process.cwd(), 'moov_config.json'))
    hostname = config['host_map'][0]
      .split('=>')[0]
      .replace(/\$/g, 'mlocal')
      .trim()
  }

  return `http://${hostname}${port}`
}
