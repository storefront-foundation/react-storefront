/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import usePersonalization from './usePersonalization'

/**
 * Provides the `usePersonalization` hook as a HOC/decorator. Use this if you're using classes,
 * use `usePersonalization` if you're using function components.
 * @param {String} branch The name of the branch in the app state tree.  For example "product" or "category".
 * @return {Function}
 */
const withPersonalization = branch => WrappedComponent => props => {
  usePersonalization(branch)
  return <WrappedComponent {...props} />
}

export default withPersonalization
