const path = require('path')

/**
 * Return the target path to the React Storefront directory.
 * @param {String} appName The name of the new app
 * @param {Object} userConfig The user's selected configuration options.
 */
const calculateReactStorefrontPath = (appName, userConfig) => {
  let targetPath = process.cwd()

  if (userConfig.createDirectory) {
    targetPath = path.resolve(targetPath, appName)
  }

  return targetPath
}

module.exports = {
  calculateReactStorefrontPath
}
