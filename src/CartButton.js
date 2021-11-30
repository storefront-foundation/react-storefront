import React from 'react'
import PropTypes from 'prop-types'
import Link from './link/Link'
import ToolbarButton from './ToolbarButton'
import { ShoppingCart as Cart } from '@mui/icons-material'
import { makeStyles } from '@mui/material/styles'
import { Badge } from '@mui/material'
import clsx from 'clsx'

export const styles = theme => ({
  /**
   * Styles applied to the [`Link`](/apiReference/link/Link) element used as the root.
   */
  link: {},
  /**
   * Styles passed through to the [`Badge`](https://mui.com/api/badge/#css) element's
   * `badge` CSS rule.
   */
  badge: {
    border: '2px solid white',
    padding: '0 4px',
  },
  /**
   * Styles applied to the button icon.
   */
  icon: {
    color: theme.palette.action.active,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFCartButton' })

/**
 * A cart header button that display the number of items in the cart using a badge.
 *
 * Example:
 *
 * ```js
 * <CartButton href="/cart" quantity={1} />
 * ```
 */
export default function CartButton({
  classes,
  href,
  as,
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
   * The url path to the cart page.
   */
  href: PropTypes.string,

  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Optional custom cart icon.
   */
  icon: PropTypes.node,

  /**
   * Props passed through to the [`ToolbarButton`](/apiReference/ToolbarButton#props) element.
   */
  buttonProps: PropTypes.object,

  /**
   * Props passed through to the [`Badge`](https://mui.com/api/badge/#props) element.
   */
  badgeProps: PropTypes.object,

  /**
   * Props passed through to the [`Link`](/apiReference/link/Link#props) element.
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
