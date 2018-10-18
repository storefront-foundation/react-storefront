/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component, Fragment } from 'react'
import PropTypes from 'prop-types'
import { inject, observer } from 'mobx-react'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import Button from '@material-ui/core/Button'
import Snackbar from '@material-ui/core/Snackbar'
import IconButton from '@material-ui/core/IconButton'
import CloseIcon from '@material-ui/icons/Close'
import Track from './Track'

/**
 * A button that when clicked adds the specified product to the cart
 */
export const styles = theme => ({
  root: {

  },
  docked: {
    fontSize: theme.typography.subheading.fontSize,
    padding: `${theme.margins.container}px`,
    position: 'fixed',
    left: 0,
    bottom: 0,
    width: '100%',
    zIndex: 1,
    borderRadius: '0'
  },
  close: {
    width: theme.spacing.unit * 4,
    height: theme.spacing.unit * 4,
  },
  confirmation: {
    padding: '2px 0'
  }
});

@withStyles(styles, { name: 'RSFAddToCartButton' })
@inject(({ app, ampFormId }) => ({ cart: app.cart, ampFormId }))
@observer
export default class AddToCartButton extends Component {

  static propTypes = {
    /**
     * The product to add to the cart
     */
    product: PropTypes.object,

    /**
     * Set to true to dock the button at the bottom of the viewport so that it is always visible
     */
    docked: PropTypes.bool,

    /**
     * A message to display when an item is added to the cart.
     * Could be a string or react component
     */
    confirmation: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),

    /**
     * Props to be applied to the Snackbar element in which the confirmation message is displayed.
     */
    snackbarProps: PropTypes.object
  }

  static defaultProps = {
    docked: false,
    snackbarProps: {}
  }

  state = {
    messageOpen: false
  }

  render() {
    const { product, ampFormId, children, classes, className, cart, docked, confirmation, snackbarProps, ...other } = this.props

    return (
      <Fragment>
        <Track event="addedToCart" product={product}>
          <Button 
            key="button"
            variant="raised" 
            color="secondary"
            size="large"
            {...other} 
            on={`tap:${ampFormId}.submit`}
            onClick={this.onClick}
            classes={{ root: classes.root }}
            className={classnames(className, { [classes.docked]: docked })}
          >
            { children || "Add to Cart" }
          </Button>
        </Track>
        <Snackbar
          key="confirmation"
          open={this.state.messageOpen}
          autoHideDuration={3000}
          onClose={this.handleClose}
          message={<div className={classes.confirmation}>{confirmation}</div>}
          action={[
            <IconButton
              key="close"
              aria-label="Close"
              color="inherit"
              className={classes.close}
              onClick={this.handleClose}
            >
              <CloseIcon/>
            </IconButton>
          ]}
          {...snackbarProps}
        />
      </Fragment>
    )
  }

  handleClose = (event, reason) => {
    if (reason === 'clickaway') return
    this.setState({ messageOpen: false })
  };

  onClick = (e) => {
    const { onClick } = this.props

    if (onClick) {
      onClick(e)
    }

    if (!e.defaultPrevented) {
      if (this.props.confirmation) {
        this.setState({ messageOpen: true })
      }
      this.props.cart.add(this.props.product)
    }
  }

}
