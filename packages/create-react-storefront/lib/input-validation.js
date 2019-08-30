const fs = require('fs')
const handleError = require('./handle-error')

/**
 * Checks the validity of a target path for React Storefront creation. A path
 * is considered valid if it does not currently exist, or if it is an empty
 * directory.
 *
 * @param {string} targetPath The path to be checked.
 */
const isTargetPathValid = targetPath => {
  try {
    // If the target path exists, and is not an empty directory, then it is
    // not valid.
    if (
      fs.existsSync(targetPath) &&
      (!fs.statSync(targetPath).isDirectory() || fs.readdirSync(targetPath).length !== 0)) {
      return false
    }
    return true
  } catch (err) {
    handleError(
      err,
      'Error checking project target paths. Ensure that you have proper permissions.'
    )
  }
}

module.exports = {
  isTargetPathValid
}
