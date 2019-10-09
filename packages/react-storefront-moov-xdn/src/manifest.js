/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
/**
 * Returns the manifest object.  Will return a stub in development that matches the structure of the object
 * that will be returned when running in the cloud.
 * @private
 * @return {Object}
 */
function getMoovManifest() {
  return (
    global.env.moovManifest || {
      DefaultMode: '000-000-000', // stub mode to emulate the structure of moovManifest during development
      Modes: {
        '000-000-000': {
          Name: 'default',
          Slug: '000-000-000/000-000-000',
          BlobS3Path: '',
          Status: 'live'
        }
      }
    }
  )
}

/**
 * Gets the name of the current mode
 * @private
 * @return {String}
 */
function getModeName() {
  return global.env.moov_mode_name || 'default' // always return default in development
}

/**
 * Returns the ID of the current mode
 * @return {String}
 */
export function getMode() {
  const name = getModeName()
  const modes = getMoovManifest().Modes

  for (let id in modes) {
    const mode = modes[id]

    if (mode.Name === name) {
      return { id, name }
    }
  }

  return null
}
