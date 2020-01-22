import React, { useState, useCallback, useRef, useEffect } from 'react'
import Link from '../link/Link'
import { makeStyles } from '@material-ui/core/styles'
import { Hidden, Fade, Tab, Popover, Paper } from '@material-ui/core'
import PropTypes from 'prop-types'
import Router from 'next/router'

const styles = theme => ({
  popover: {
    pointerEvents: 'none',
  },
  tab: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(2),
  },
  link: {
    textDecoration: 'none',
    color: 'inherit',
    fontWeight: 100,
  },
  menu: {
    zIndex: theme.zIndex.appBar,
  },
  ripple: {
    zIndex: 2,
  },
  paper: {
    pointerEvents: 'all',
    paddingTop: 2, // we add 2 pixels of transparent padding and move the menu up two pixels to cover the tab indicator
    marginTop: -2, // so that the user doesn't temporarily mouse over the indicator when moving between the tab and the menu, causing the menu to flicker.
    background: 'transparent',
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
  },
  innerPaper: {
    borderTop: `1px solid ${theme.palette.divider}`,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFNavTab' })

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
 * This component supports keyboard navigation.  The user can open the menu by pressing the enter key when the NavTab is focused.
 */
function NavTab({ classes, href, as, children, ...props }) {
  classes = useStyles({ classes })

  const [overTab, setOverTab] = useState(false)
  const [overMenu, setOverMenu] = useState(false)
  const [anchorEl, setAnchorEl] = useState(null)
  const [focused, setFocused] = useState(false)

  const showMenu = useCallback(event => {
    setOverTab(true)
    setAnchorEl(event.currentTarget)
  }, [])

  // We use setImmediate here to delay the tab and menu exit events give time for the user to enter
  // the tab or menu so that the menu doesn't flash when the user is transitioning between tab and menu.
  const hideMenu = useCallback(() => setImmediate(() => setOverTab(false)), [])
  const leaveMenu = useCallback(() => setImmediate(() => setOverMenu(false)), [])
  const enterMenu = useCallback(() => setOverMenu(true), [])
  const menuItemBlurPending = useRef(false)

  // accessibility: open the menu when the user presses enter with the tab focused
  const handleTabKeyDown = useCallback(e => {
    if (e.key === 'Enter') {
      e.preventDefault()
      setAnchorEl(e.currentTarget)
      setFocused(true)
    }
  }, [])

  // Keep track of when an item in the menu is focused.
  const handleMenuItemFocus = useCallback(() => {
    // When tabbing through menu items, the current one will blur before the next one focuses.
    // So we need to let the event loop finish one cycle to see if another item in the menu receives focus before
    // determining that the menu has lost focus and should be closed.
    menuItemBlurPending.current = false

    if (!focused) {
      setFocused(true)
    }
  }, [focused])

  // When a menu item loses focus, we close the menu if another menu item doesn't immediately gain focus
  const handleMenuItemBlur = useCallback(() => {
    menuItemBlurPending.current = true

    setImmediate(() => {
      if (menuItemBlurPending.current) {
        setFocused(false)
      }
    })
  }, [])

  const open = overTab || overMenu || focused

  // close the menu when the user navigates to a new page
  useEffect(() => {
    const onHistoryChange = () => handleMenuItemBlur()
    const unsubscribe = () => Router.events.off('routeChangeStart', onHistoryChange)

    if (open) {
      Router.events.on('routeChangeStart', onHistoryChange)
    } else {
      unsubscribe()
    }

    return unsubscribe
  }, [open])

  return (
    <>
      <Link
        className={classes.link}
        href={href}
        as={as}
        onClick={hideMenu} // Does not work in dev, because next consumes focus in production everything is good
        onMouseEnter={showMenu}
        onMouseLeave={hideMenu}
        prefetch="visible"
      >
        <Tab
          onKeyDown={handleTabKeyDown}
          classes={{ root: classes.tab }}
          aria-haspopup={children != null}
          aria-expanded={open}
          {...props}
          TouchRippleProps={{
            classes: {
              root: classes.ripple,
            },
          }}
        />
      </Link>
      {!children ? null : (
        <Hidden xsDown>
          <Popover
            open={open}
            className={classes.popover}
            anchorEl={anchorEl}
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
              onMouseEnter: enterMenu,
              onMouseLeave: leaveMenu,
              onClick: leaveMenu,
              square: true,
              className: classes.paper,
            }}
          >
            <Paper
              className={classes.innerPaper}
              onBlurCapture={handleMenuItemBlur}
              onFocusCapture={handleMenuItemFocus}
              square
            >
              {children}
            </Paper>
          </Popover>
        </Hidden>
      )}
    </>
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
}

export default React.memo(NavTab)
