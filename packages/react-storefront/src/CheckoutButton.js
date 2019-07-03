/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Button from '@material-ui/core/Button'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/'
import { inject } from 'mobx-react'
import classnames from 'classnames'

/**
 * A button that links to Checkout, to be displayed on the Cart page.  The style matches
 * AddToCartButton by default.
 */
export const styles = theme => ({
  root: {
    fontSize: theme.typography.subheading.fontSize,
    padding: `${theme.margins.container}px`
  },
  docked: {
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1,
    borderRadius: '0'
  }
})

@withStyles(styles, { name: 'RSFCheckoutButton' })
@inject('history')
export default class CheckoutButton extends Component {
  static propTypes = {
    /**
     * The URL for checkout.  Defaults to "/checkout"
     */
    url: PropTypes.string,

    /**
     * Set to true to dock the button at the bottom of the viewport so that it is always visible
     */
    docked: PropTypes.bool
  }

  static defaultProps = {
    url: '/checkout',
    docked: false
  }

  render() {
    const { classes, className, url, children, docked, ...others } = this.props

    return (
      <Button
        size="large"
        color="secondary"
        onClick={this.onClick}
        variant="contained"
        data-th="checkout"
        {...others}
        classes={{ root: classes.root }}
        className={classnames(className, { [classes.docked]: docked })}
      >
        {children || 'Checkout'}
      </Button>
    )
  }

  onClick = () => {
    const { history, url } = this.props

    if (url.match(/^(https?:)?\/\//)) {
      window.location.href = url
    } else {
      history.push(url)
    }
  }
}
