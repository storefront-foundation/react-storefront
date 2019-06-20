/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React from 'react'
import usePersonalization from './usePersonalization'

/**
 * Provides the `usePersonalization` hook as a HOC/decorator. Use this if you're using classes,
 * use `usePersonalization` if you're using function components.
 *
 * Example
 *
 * ```js
 * @withPersonalization(app => app.product) // app.product.loadPersonalization will be called when the Product component is displayed
 * @inject('app')
 * @observer
 * class Product extends Component {
 *
 * }
 * ```
 *
 * @param {Function} branch A function that returns the model that should fetch personalized data.
 * @return {Function}
 */
const withPersonalization = branch => WrappedComponent => props => {
  usePersonalization(branch)
  return <WrappedComponent {...props} />
}

export default withPersonalization
