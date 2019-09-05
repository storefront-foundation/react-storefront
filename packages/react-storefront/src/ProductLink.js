/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import PageLink from './PageLink'

/**
 * A link to the PDP which reuses the thumbnail image from the Subcategory page.
 * The product prop accepts an instance of ProductModelBase or any model that implements createLinkState().
 * This component wraps react-storefront/Link and supports all of its props.
 */
export default class ProductLink extends Component {
  static propTypes = {
    /**
     * An instance of ProductModelBase or a model that implements createLinkState()
     */
    product: PropTypes.object.isRequired
  }

  render() {
    const { product, ...others } = this.props
    return (
      <PageLink
        page="Product"
        model={product}
        anchorProps={{ 'data-th': 'product-link' }}
        {...others}
      />
    )
  }
}
