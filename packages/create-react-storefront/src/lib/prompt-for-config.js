/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
const _ = require('lodash')
const prompts = require('prompts')

const _initialDevHostname = (_prev, values) => {
  return `dev.${values.prodHostname}`
}

const _initialDevUpstream = (_prev, values) => {
  const tokens = values.devHostname.split('.')
  tokens[0] = `${tokens[0]}-origin`
  return tokens.join('.')
}

const _initialProdUpstream = (_prev, values) => {
  return `origin.${values.prodHostname}`
}

const _requireInput = value => {
  if (!value || value.trim().length === 0) {
    return 'This field is required.'
  } else {
    return true
  }
}

const defaultQuestions = [
  {
    name: 'version',
    type: 'text',
    message: 'version',
    initial: '1.0.0'
  },
  {
    name: 'description',
    type: 'text',
    message: 'description'
  },
  {
    name: 'repoUrl',
    type: 'text',
    message: 'repository url'
  },
  {
    name: 'author',
    type: 'text',
    message: 'author'
  },
  {
    name: 'license',
    type: 'text',
    message: 'license',
    initial: 'UNLICENSED'
  },
  {
    name: 'private',
    type: 'toggle',
    message: 'private',
    initial: true,
    active: 'true',
    inactive: 'false'
  },
  {
    name: 'createDirectory',
    type: 'toggle',
    message: 'create a directory for this app?',
    initial: true,
    active: 'yes',
    inactive: 'no'
  }
]

const upstreamQuestions = [
  {
    name: 'prodHostname',
    type: 'text',
    message: 'hostname for production site in moov cloud',
    validate: _requireInput
  },
  {
    name: 'prodUpstream',
    type: 'text',
    message: 'upstream hostname for production moov cloud',
    validate: _requireInput,
    initial: _initialProdUpstream
  },
  {
    name: 'devHostname',
    type: 'text',
    message: 'hostname for development site in moov cloud',
    validate: _requireInput,
    initial: _initialDevHostname
  },
  {
    name: 'devUpstream',
    type: 'text',
    message: 'upstream hostname for development moov cloud',
    validate: _requireInput,
    initial: _initialDevUpstream
  }
]

/**
 * Prompt user for React Storefront configuration options.
 */
const promptForConfig = async configUpstream => {
  console.log(
    "\nLet's create a new React Storefront app! First, I need you to provide some information for package.json...\n"
  )

  const defaultQuestionResponses = await prompts(defaultQuestions)

  // If the user has not provided all input, abort.
  if (Object.keys(defaultQuestionResponses).length !== defaultQuestions.length) {
    throw new Error('User configuration is incomplete. Aborting.')
  }

  if (configUpstream) {
    console.log(
      "\nYou've indicated that you'd like to configure an upstream site. Let's do that now...\n"
    )

    const upstreamQuestionResponses = await prompts(upstreamQuestions)

    // If the user has not provided all input, abort.
    if (Object.keys(upstreamQuestionResponses).length !== upstreamQuestions.length) {
      throw new Error('User configuration is incomplete. Aborting.')
    }

    // Merge the answers to the different sets of questions into one
    // configuration object. Note that this is acceptable only because all
    // questions have unique names. When adding questions, ensure that this
    // remains the case.
    _.merge(defaultQuestionResponses, upstreamQuestionResponses)
  }

  // If upstream responses were given, they have been merged into this object.
  return defaultQuestionResponses
}

module.exports = {
  _initialDevHostname,
  _initialDevUpstream,
  _initialProdUpstream,
  _requireInput,
  promptForConfig
}
