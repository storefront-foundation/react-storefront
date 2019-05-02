/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import { inject } from 'mobx-react'
import LoadMask from '../LoadMask'
import withStyles from '@material-ui/core/styles/withStyles'
import { Provider } from 'mobx-react'
import PropTypes from 'prop-types'

export const styles = theme => ({
  mask: {
    display: 'none',
    '.amp-form-submitting &, .moov-amp-form-mask &': {
      display: 'flex'
    }
  }
})

/**
 * An AMP-compatible form.  When not rendering AMP content, this component renders a simple div.
 * This component will automatically cover itself with a modal loading spinner when submitting.
 */
@inject(({ app, nextId, ampStateId }) => ({ app, nextId, ampStateId }))
@withStyles(styles, { name: 'RSFAmpForm' })
export default class AmpForm extends Component {
  static propTypes = {
    /**
     * The id for the amp-form element.  If left blank a unique id will automatically be generated.
     */
    id: PropTypes.string,

    /**
     * The form's action attribute. Defaults to "_top".
     */
    target: PropTypes.string,

    /**
     * The HTTP method to use.  Defaults to "get".
     */
    method: PropTypes.oneOf(['get', 'post']),

    /**
     * Set to false to not show the mask when submitting.  Defaults to true.
     */
    mask: PropTypes.bool
  }

  static defaultProps = {
    target: '_top',
    method: 'get',
    mask: true
  }

  constructor({ id, nextId }) {
    super()
    this.id = id || nextId()
  }

  render() {
    let {
      on,
      ampStateId,
      app,
      mask,
      classes,
      method,
      target,
      id,
      children,
      action,
      nextId,
      ...others
    } = this.props
    let bind = others['amp-bind']
    const validation = others['custom-validation-reporting']

    if (app.amp) {
      // add event handler for valid state to display the mask when submitting
      // we do this because the submit event doesn't work when method=get
      if (
        method.toLowerCase() === 'get' &&
        (validation == null || validation == 'show-first-on-submit')
      ) {
        on =
          (on ? on + ',' : '') +
          `valid:AMP.setState({ ${ampStateId}: { ___moov_submitting: true }})`
        bind =
          (on ? on + ',' : '') +
          `class=>${ampStateId}.___moov_submitting ? 'moov-amp-form-mask' : null`
      }

      return (
        <Provider ampFormId={this.id}>
          <form
            id={this.id}
            data-id={this.id}
            method={method}
            target={target}
            {...{
              [method === 'post' ? 'action-xhr' : 'action']: action
            }}
            {...others}
            on={on}
            amp-bind={bind}
          >
            <Helmet>
              <script
                async
                custom-element="amp-form"
                src="https://cdn.ampproject.org/v0/amp-form-0.1.js"
              />
            </Helmet>

            {mask && <LoadMask className={classes.mask} />}
            {children}
          </form>
        </Provider>
      )
    } else {
      return <div {...others}>{children}</div>
    }
  }
}
