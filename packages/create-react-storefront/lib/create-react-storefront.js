const { calculateReactStorefrontPath } = require('./utils')
const { checkTemplateExistence } = require('./retrieve-template')
const createReactStorefrontInternal = require('./create-react-storefront-internal')
const { promptForConfig } = require('./prompt-for-config')
const configDefaults = require('./config-defaults')

const _calculateStartCommand = () => {
  if (process.platform === 'win32') {
    return 'npm run start:windows'
  } else {
    return 'npm start'
  }
}

/**
 * The entry point to creating a React Storefront project.
 */
const createReactStorefront = async options => {
  let userConfig = {
    version: configDefaults.version,
    description: '',
    repoUrl: '',
    author: '',
    license: configDefaults.license,
    private: configDefaults.private,
    createDirectory: configDefaults.createDirectory
  }

  if (!(await checkTemplateExistence(options.branch))) {
    console.log(
      `The ${options.branch} branch of boilerplate does not exist. Check your spelling or use the default.`
    )
    return
  }

  if (!options.yes) {
    try {
      userConfig = await promptForConfig({ configUpstream: options.configureUpstream })
    } catch (err) {
      console.log(err.message)
      return
    }
  }

  await createReactStorefrontInternal(options, userConfig)
}

module.exports = {
  _calculateStartCommand,
  createReactStorefront
}
