/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Link from './Link'
import { PropTypes } from 'mobx-react'

/**
 * A link to a product that automatically pushes the product's thumbnail into the product skeleton
 * via AppModelBase.productThumbnail and sets AppModelBase.product when the link is clicked.
 * 
 * This components wraps react-storefront/Link and supports all of its props.
 */
export default class ProductLink extends Component {

  static propTypes = {
    /**
     * An instance of ProductModelBase to link to
     */
    product: PropTypes.observableObject
  }

  render() {
    let { product, ...others } = this.props
    
    const state = {
      product: product.toJSON(),
      productThumbnail: product.thumbnail
    }
    
    return <Link to={product.url} state={state} {...others} />
  }

}