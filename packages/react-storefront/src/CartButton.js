/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Link from './Link'
import Cart from '@material-ui/icons/ShoppingCart'
import ToolbarButton from './ToolbarButton'
import { inject, observer } from 'mobx-react'
import { withStyles } from '@material-ui/core/'
import Track from './Track'

export const styles = theme => ({
  cartQuantity: {
    color: '#fff',
    backgroundColor: theme.palette.primary.main,
    height: '20px',
    width: '20px',
    lineHeight: '20px',
    fontSize: '14px',
    borderRadius: '50%',
    position: 'absolute',
    top: '3px',
    right: '5px'
  },
  icon: {

  }
});

@withStyles(styles, { name: 'RSFCartButton' })
@inject(({ app }) => ({ cart: app.cart }))
@observer
export default class CartButton extends Component {
  static propTypes = {
    /**
     * The url path to cart.  Defaults to "/cart"
     */
    path: PropTypes.string,

    /**
     * Set to true to force server side navigation.  Defaults to false
     */
    server: PropTypes.bool,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * Optional Custom cart icon
     */
    icon: PropTypes.element
  }

  static defaultProps = {
    path: '/cart'
  }

  render() {
    const { classes, cart, path, server, onClick, icon, ...buttonProps } = this.props
    const cartIcon = icon ? icon : <Cart className={classes.icon}/>

    return (
      <Track event="cartClicked">
        <Link to={path} server={server} onClick={onClick}>
          <ToolbarButton
            aria-label="Cart"
            color="inherit"
            icon={cartIcon}
            {...buttonProps}
          >
            {cart && cart.quantity > 0 && <div className={classes.cartQuantity}>{cart.quantity}</div>}
          </ToolbarButton>
        </Link>
      </Track>
    )
  }

}
