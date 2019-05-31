/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import usePersonalization from './usePersonalization'

/**
 * Provides the `usePersonalization` hook as a HOC/decorator.
 * @param {String} branch
 */
const withPersonalization = branch => WrappedComponent => props => {
  usePersonalization(branch)
  return <WrappedComponent {...props} />
}

export default withPersonalization
