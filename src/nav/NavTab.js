import React, { useState, useCallback, useRef, useEffect } from 'react'
import { styled } from '@mui/material/styles'
import { Hidden, Fade, Tab, Popover, Paper, Menu } from '@mui/material'
import PropTypes from 'prop-types'
import Router from 'next/router'
import Link from '../link/Link'

import Menu from '@mui/material/Menu'

import PopupState, { bindHover, bindPopover } from 'material-ui-popup-state'
import { usePopupState } from 'material-ui-popup-state/hooks'

import HoverPopover from 'material-ui-popup-state/HoverPopover'

const PREFIX = 'RSFNavTab'

const defaultClasses = {
  popover: `${PREFIX}-popover`,
  tab: `${PREFIX}-tab`,
  link: `${PREFIX}-link`,
  ripple: `${PREFIX}-ripple`,
  paper: `${PREFIX}-paper`,
  innerPaper: `${PREFIX}-innerPaper`,
}

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the Popover element for desktop users.
   */
  [`& .${defaultClasses.popover}`]: {
    pointerEvents: 'none',
    maxHeight: '80%',
  },

  /**
   * Styles applied to the `Tab` element.
   */
  [`& .${defaultClasses.tab}`]: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },

  /**
   * Styles applied to the root [`Link`](/apiReference/link/Link) element.
   */
  [`& .${defaultClasses.link}`]: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 300,
  },

  /**
   * Styles applied to the root element of the `Tab`'s `TouchRippleProps` classes.
   */
  [`& .${defaultClasses.ripple}`]: {
    zIndex: 2,
  },

  /**
   * Styles applied to the Popover element's `Paper` element for desktop users.
   */
  [`& .${defaultClasses.paper}`]: {
    pointerEvents: 'all',
    paddingTop: 2, // we add 2 pixels of transparent padding and move the menu up two pixels to cover the tab indicator
    marginTop: -2, // so that the user doesn't temporarily mouse over the indicator when moving between the tab and the menu, causing the menu to flicker.
    background: 'transparent',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
  },

  /**
   * Styles applied to the Popover element's `Paper` element for desktop users.
   */
  [`& .${defaultClasses.innerPaper}`]: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
}))

/**
 * A single navigational tab, which links to another page in the app based on the `as` and `href` props.
 * Children are displayed in a menu that is shown on mouse over on desktop devices.
 *
 * Example:
 *
 * ```js
 *  <NavTab href="/c/[categoryId]" as="/c/shirts" label="Shirts">
 *    <div style={{ padding: 20 }}>
 *      <Link href="/s/[subcategoryId]" as="/s/long-sleeve-shirts">Long Sleeve Shirts</Link>
 *      <Link href="/s/[subcategoryId]" as="/s/turtlenecks">Turtlenecks</Link>
 *      <Link href="/s/[subcategoryId]" as="/s/tees">Tee Shirts</Link>
 *    </div>
 *  </NavTab>
 * ```
 *
 * Accessibility:
 *
 * This component supports keyboard navigation.  The user can open the menu by pressing the enter key when the `NavTab` is focused.
 */
const NavTab = function({ href, as, prefetch, children, classes: c = {}, ...props }) {
  const classes = { ...defaultClasses, ...c }

  const popupState = usePopupState({
    variant: 'popover',
    popupId: 'navTabPopup'
  })

  const handleEnterKeyDown = useCallback(e => {
    if(e.key === 'Enter') {
      e.preventDefault()
      popupState.open(e)
    }
  }, [])

  const hideMenu = useCallback(e => {
    e.preventDefault()
    popupState.close(e)
  }, [])

  return (
    <Root>
      <Link
        className={classes.link}
        href={href}
        as={as}
        onClick={hideMenu}
        prefetch={prefetch}
        {...bindHover(popupState)}
      >
        <Tab
          onKeyDown={handleEnterKeyDown}
          classes={{ root: classes.tab }}
          aria-haspopup={children != null}
          aria-expanded={popupState.isOpen}
          {...props}
          TouchRippleProps={{
            classes: {
              root: classes.ripple,
            },
          }}
        />
      </Link>
      {!children ? null : (
        <Hidden smDown>
          <HoverPopover
            {...bindPopover(popupState)}
            className={classes.popover}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'center',
            }}
            TransitionComponent={Fade}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
            PaperProps={{
              square: true,
              className: classes.paper,
            }}
            classes={classes}
          >
            <Paper
              className={classes.innerPaper}
              square
            >
              {children}
            </Paper>
          </HoverPopover>
        </Hidden>
      )}
    </Root>
  )
}

NavTab.propTypes = {
  /**
   * The link path
   */
  as: PropTypes.string.isRequired,
  /**
   * The next.js route pattern
   */
  href: PropTypes.string.isRequired,
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  prefetch: PropTypes.oneOf(['always', 'visible', false]),
}

export default React.memo(NavTab)
