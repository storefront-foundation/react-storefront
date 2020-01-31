import React, { memo, useState, useEffect, useContext, useRef } from 'react'
import ActionButton from '../ActionButton'
import Sort from './Sort'
import PropTypes from 'prop-types'
import Drawer from '../drawer/Drawer'
import { Menu, useMediaQuery } from '@material-ui/core'
import { useTheme } from '@material-ui/core/styles'
import { useRouter } from 'next/router'
import SearchResultsContext from './SearchResultsContext'

/**
 * A button that when clicked, opens a drawer containing the `Sort` view. The name of the currently
 * selected sortOption is display in the button text.
 */
function SortButton({
  variant,
  title,
  drawerProps,
  onClick,
  sortProps,
  drawerBreakpoint,
  href,
  ...props
}) {
  const theme = useTheme()
  const openSort = useRouter().query.openSort === '1'
  const [state, setState] = useState({
    open: false,
    mountDrawer: false,
    anchorEl: null,
  })
  const { open, mountDrawer, anchorEl } = state
  const {
    pageData: { sort, sortOptions },
  } = useContext(SearchResultsContext)
  const buttonRef = useRef()
  const selectedOption = sortOptions.find(o => sort === o.code)

  useEffect(() => {
    if (location.search.indexOf('openSort') !== -1) {
      setState({ open: true, mountDrawer: true, anchorEl: buttonRef.current })
    }
  }, [])

  const handleClick = e => {
    if (onClick) {
      onClick(e)
    }

    if (!e.defaultPrevented) {
      toggleOpen(true, e.currentTarget)
    }
  }

  const close = () => {
    toggleOpen(false)
  }

  const toggleOpen = (open, anchorEl) => {
    if (open) {
      setState({ mountDrawer: true, open: true, anchorEl: anchorEl })
    } else {
      setState({ open: false, anchorEl: null })
    }
  }

  const useDrawer = useMediaQuery(theme.breakpoints.down(drawerBreakpoint))

  return (
    <>
      <ActionButton
        key="button"
        label={title}
        ref={buttonRef}
        value={selectedOption && selectedOption.name}
        href={href}
        {...props}
        onClick={e => handleClick(e)}
      />
      {!href && useDrawer && (
        <Drawer
          ModalProps={{
            keepMounted: true,
          }}
          key="drawer"
          anchor="bottom"
          title={title}
          open={open}
          onClose={close}
          {...drawerProps}
        >
          {mountDrawer && <Sort onSelect={close} {...sortProps} />}
        </Drawer>
      )}
      {!href && !useDrawer && (
        <Menu open={open} anchorEl={anchorEl} onClose={close}>
          <Sort variant="menu-items" onSelect={close} {...sortProps} />
        </Menu>
      )}
    </>
  )
}

SortButton.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Props to pass to the underlying `Drawer` component.
   */
  drawerProps: PropTypes.object,

  /**
   * Props to pass to the underlying `Sort` component.
   */
  sortProps: PropTypes.object,

  /**
   * Text for the button label and the drawer header.  Defaults to "Sort".
   */
  title: PropTypes.string,

  /**
   * The breakpoint in your theme below which a drawer UI should be used in favor of the menu UI.
   */
  drawerBreakpoint: PropTypes.string,

  /**
   * When specified, clicking the button will navigate to the specified URL with a full page reload.
   */
  href: PropTypes.string,
}

SortButton.defaultProps = {
  title: 'Sort',
  drawerProps: {},
  sortProps: {},
  drawerBreakpoint: 'xs',
}

export default memo(SortButton)
