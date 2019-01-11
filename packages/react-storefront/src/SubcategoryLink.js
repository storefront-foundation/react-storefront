/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PageLink from './PageLink'
import PropTypes from 'prop-types'

/**
 * A link to a subcategory that automatically pushes the product's thumbnail into the product skeleton
 * via AppModelBase.loadingProduct. The subcategory prop accepts an instance of SubcategoryModelBase or any 
 * model that implements createLinkState(). This components wraps react-storefront/Link and supports all of its props.
 */
export default class SubcategoryLink extends Component {

  static propTypes = {
    /**
     * An instance of SubcategoryModelBase
     */
    subcategory: PropTypes.object.isRequired
  }

  render() {
    const { subcategory, ...others } = this.props
    return <PageLink page="Subcategory" model={subcategory} {...others}/>
  }

}