/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import { PropTypes } from 'prop-types'
import { Provider, inject } from 'mobx-react'
import { Helmet } from 'react-helmet'

/**
 * A container that initialize amp state to be consumed by child components.  Components that support AMP functionality
 * like QuantitySelector and TapPanel must be inside an AmpState element.
 */
@inject(({ app }) => ({ amp: app.amp }))
export default class AmpState extends Component {
  static propTypes = {
    /**
     * The initial values for the amp-state.  Defaults to `{}`
     */
    initialState: PropTypes.object,

    /**
     * An id for the root amp state object. Defaults to "moovAmpState".
     */
    id: PropTypes.string,
  }

  static defaultProps = {
    initialState: {},
    id: 'moovAmpState',
  }

  render() {
    const { id, amp, initialState, children } = this.props

    return (
      <Provider ampStateId={id}>
        {amp ? (
          <Fragment>
            <Helmet>
              <script
                async
                custom-element="amp-bind"
                src="https://cdn.ampproject.org/v0/amp-bind-0.1.js"
              />
            </Helmet>
            <amp-state id={id}>
              <script
                type="application/json"
                dangerouslySetInnerHTML={{
                  __html: JSON.stringify(
                    initialState.toJSON ? initialState.toJSON() : initialState,
                  ),
                }}
              />
            </amp-state>
            {children}
          </Fragment>
        ) : (
          <Fragment>{children}</Fragment>
        )}
      </Provider>
    )
  }
}
