import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import Link from './link/Link'
import ToolbarButton from './ToolbarButton'
import { ShoppingCart as Cart } from '@mui/icons-material'
import { Badge } from '@mui/material'
import clsx from 'clsx'

const PREFIX = 'RSFCartButton'

const defaultClasses = {
  link: `${PREFIX}-link`,
  badge: `${PREFIX}-badge`,
  icon: `${PREFIX}-icon`,
}

const StyledLink = styled(Link)(({ theme }) => ({
  /**
   * Styles applied to the [`Link`](/apiReference/link/Link) element used as the root.
   */
  [`&.${defaultClasses.link}`]: {},

  /**
   * Styles passed through to the [`Badge`](https://mui.com/api/badge/#css) element's
   * `badge` CSS rule.
   */
  [`& .${defaultClasses.badge}`]: {
    border: '2px solid white',
    padding: '0 4px',
  },

  /**
   * Styles applied to the button icon.
   */
  [`& .${defaultClasses.icon}`]: {
    color: theme.palette.action.active,
  },
}))

export {}

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
  href,
  as,
  onClick,
  icon,
  quantity,
  classes: c = {},
  linkProps,
  badgeProps,
  buttonProps,
}) {
  const classes = { ...defaultClasses, ...c }
  const cartIcon = icon || <Cart className={classes.icon} />

  return (
    <StyledLink
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
    </StyledLink>
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
