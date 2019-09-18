const { RawSource } = require('webpack-sources')
const requireFromString = require('require-from-string')

module.exports = class OEMConfigWriterPlugin {
  constructor({ outputFile }) {
    this.outputFile = outputFile
    this.previousOEMConfigJson = null
  }

  apply(compiler) {
    compiler.hooks.emit.tap('OEMConfigWriterPlugin', compilation => {
      // Not all customer project will have the `routesPath` attribute provided
      // to react-storefront/webpack/client#prod() options
      if (!compilation.assets['routes.js']) {
        return
      }

      // We load transpiled routes.js from memory and not from the file, because the file is not yet writter
      // at 'emit' compiler hook time.
      // We could have used the 'done' hook, but that makes it harder to emit to resulting oem.json file.
      const routes = requireFromString(compilation.assets['routes.js'].source()).default

      // This was just included for this step, but not used in final build
      delete compilation.assets['routes.js']
      delete compilation.assets['routes.js.map']

      const OEMConfig = routes.createEdgeConfiguration()
      const OEMConfigJson = JSON.stringify(OEMConfig)

      if (OEMConfigJson !== this.previousOEMConfigJson) {
        compilation.assets[this.outputFile] = new RawSource(OEMConfigJson)
        this.previousOEMConfigJson = OEMConfigJson
      }
    })
  }
}
