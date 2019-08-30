const decompress = require('decompress')
const download = require('download')
const fs = require('fs')
const handleError = require('./handle-error')
const path = require('path')
const util = require('util')
const urlExists = util.promisify(require('url-exists'))
const defaultBranchName = 'master'
const downloadedTemplateName = 'react_storefront_template.zip'

const _deleteTemplate = () => {
  try {
    fs.unlinkSync(_getTemplatePath())
  } catch (err) {
    handleError(
      err,
      `Compressed template deletion failed. Compressed template is located at ${_getTemplatePath()}`
    )
  }
}

const _calculateTemplateUrl = branch => {
  return `https://github.com/moovweb/react-storefront-boilerplate/zipball/${branch}`
}

const _downloadTemplate = async ({ templateUrl } = {}) => {
  try {
    await download(templateUrl, process.cwd(), {
      filename: downloadedTemplateName
    })
  } catch (err) {
    handleError(
      err,
      `Error downloading the React Storefront template. Please check your network connection.`
    )
  }
}

const _getTemplatePath = () => {
  return path.resolve(process.cwd(), downloadedTemplateName)
}

const _unzipTemplate = async targetPath => {
  try {
    await decompress(_getTemplatePath(), targetPath, {
      strip: 1
    })
  } catch (err) {
    handleError(err, 'Error decompressing the React Storefront template. See error stack above.')
  }
}

/**
 * Checks the existence of the specified React Storefront template.
 *
 * @param {string} branch The branch of boilerplate repo to check.
 */
const checkTemplateExistence = async branch => {
  try {
    return await urlExists(_calculateTemplateUrl(branch))
  } catch (err) {
    handleError(err, 'Error checking template existence. Please check your network connection.')
  }
}

/**
 * Downloads the React Storefront template, decompresses it, and deletes the archive.
 *
 * @param {string} branch The branch name to checkout the boilerplate from.
 * @param {string} targetPath The location to decompress the template to.
 */
const retrieveTemplate = async ({ branch, targetPath }) => {
  if (!branch) {
    throw new Error('No branch name provided.')
  }

  await _downloadTemplate({
    templateUrl: _calculateTemplateUrl(branch)
  })

  await _unzipTemplate(targetPath)

  // always install the latest dependencies
  fs.unlinkSync(path.join(targetPath, 'package-lock.json'))

  // delete the demo deploy template
  fs.unlinkSync(path.join(targetPath, 'moov_config-demo.json'))

  _deleteTemplate()
}

module.exports = {
  _deleteTemplate,
  _downloadTemplate,
  _getTemplatePath,
  _unzipTemplate,
  retrieveTemplate,
  checkTemplateExistence
}
