import React from 'react'
import PropTypes from 'prop-types'
import Link from './link/Link'
import ToolbarButton from './ToolbarButton'
import { ShoppingCart as Cart } from '@material-ui/icons'
import { makeStyles } from '@material-ui/core/styles'
import { Badge } from '@material-ui/core'
import clsx from 'clsx'

export const styles = theme => ({
  badge: {
    border: '2px solid white',
    padding: '0 4px',
  },
  icon: {},
  link: {
    color: 'inherit',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCartButton' })

/**
 * A cart header button that display the number of items in the cart using a badge.
 *
 * Example:
 *
 * ```js
 * <CartButton href="/cart" quantity={1}/>
 * ```
 */
export default function CartButton({
  classes,
  href,
  as,
  server,
  onClick,
  icon,
  quantity,
  linkProps,
  badgeProps,
  buttonProps,
}) {
  classes = useStyles({ classes })
  const cartIcon = icon || <Cart className={classes.icon} />

  return (
    <Link
      {...linkProps.anchorProps}
      className={clsx(classes.link, linkProps.className)}
      href={href}
      as={as}
      server={server}
      onClick={onClick}
    >
      <ToolbarButton {...buttonProps}>
        <Badge
          badgeContent={quantity}
          {...badgeProps}
          classes={{ ...badgeProps.classes, badge: classes.badge }}
        >
          {cartIcon}
        </Badge>
      </ToolbarButton>
    </Link>
  )
}

CartButton.propTypes = {
  /**
   * The url path to cart.  Defaults to "/cart"
   */
  href: PropTypes.string,

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
  icon: PropTypes.element,

  /**
   * Props for the Button element.
   */
  buttonProps: PropTypes.object,

  /**
   * Props for the Badge element.
   */
  badgeProps: PropTypes.object,

  /**
   * Props for the Link element.
   */
  linkProps: PropTypes.object,
}

CartButton.defaultProps = {
  href: '/cart',
  badgeProps: {
    color: 'primary',
  },
  buttonProps: {
    ['aria-label']: 'Cart',
    color: 'inherit',
  },
  linkProps: {
    anchorProps: { 'data-th': 'cart-link' },
  },
}
