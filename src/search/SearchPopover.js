import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import { Popover } from '@mui/material'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'

const PREFIX = 'RSFSearchPopover'

const defaultClasses = {
  popoverPaper: `${PREFIX}-popoverPaper`,
}

const StyledPopover = styled(Popover)(({ theme }) => ({
  /**
   * Styles applied to the popover paper
   */
  [`& .${defaultClasses.popoverPaper}`]: {
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
    minWidth: theme.spacing(84),
    minHeight: theme.spacing(75),
    border: `1px solid ${theme.palette.divider}`,
  },
}))

export {}

/**
 * Displays search results in a popover. Additional props are spread to the underlying Material UI Popover element.
 */
export default function SearchPopover({
  classes: c = {},
  children,
  open,
  onClose,
  anchor,
  setQuery,
  ...others
}) {
  const classes = { ...defaultClasses, ...c }
  const handleNavigation = () => {
    if (onClose) {
      onClose()
    }

    if (setQuery) {
      setQuery('')
    }

    anchor.current.blur()
  }

  useNavigationEvent(handleNavigation)

  return (
    <StyledPopover
      open={open}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
      disableScrollLock
      keepMounted
      onClose={onClose}
      anchorEl={anchor.current}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'right',
      }}
      PaperProps={{
        square: true,
        className: classes.popoverPaper,
      }}
      {...others}
    >
      {children}
    </StyledPopover>
  )
}

SearchPopover.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,
  /**
   * A list of `ExpandableSection`s that will be controlled.
   */
  children: PropTypes.node,
  /**
   * Boolean, which controls if popover is open.
   */
  open: PropTypes.bool,
  /**
   * Function, which is triggered on navigation and popover close.
   */
  onClose: PropTypes.func,
  /**
   * Popover anchor
   */
  anchor: PropTypes.shape({ current: PropTypes.any }),
  /**
   * Function, for setting query to empty after navigation
   */
  setQuery: PropTypes.func,
}
