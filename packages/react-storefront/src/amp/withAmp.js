/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import { inject, observer } from 'mobx-react'
import React, { Component, Fragment } from 'react'
import { Helmet } from 'react-helmet'

/**
 * An HOC that links the AMP equivalent of the current page by adding the ink rel="amphtml" 
 * tag to the document head. Assign this to all views for which AMP is implemented
 * 
 * Example:
 * 
 *  import React, { Component } from 'react'
 *  import withAmp from 'react-storefront/amp/withAmp'
 * 
 *  @withAmp
 *  export default class Product extends Component {
 *    ...
 *  }
 * 
 * @param {React.Component} WrappedComponent The component to add
 * @return {React.Component}
 */
export default function withAmp(WrappedComponent) {

  @inject('app', 'history')
  @observer
  class WithAmp extends Component {
    render() {
      const { pathname, search, hostname } = this.props.app.location
      const { amp } = this.props.app

      return (
        <Fragment>
          {!amp && (
            <Helmet key="amp">
              <link rel="amphtml" href={`https://${hostname}${pathname}.amp${search}`}/>
            </Helmet>
          )}
          <WrappedComponent key="component" {...this.props} />
        </Fragment>
      )
    }

  }

  return WithAmp
}