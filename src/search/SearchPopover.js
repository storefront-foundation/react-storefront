import React, { ElementType } from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'

export const styles = theme => ({
  /**
   * Styles applied to the popover paper
   */
  popoverPaper: {
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
    minWidth: theme.spacing(84),
    minHeight: theme.spacing(75),
    border: `1px solid ${theme.palette.divider}`,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchPopover' })

export default function SearchPopover({ classes, children, open, onClose, anchor, setQuery }) {
  classes = useStyles({ classes })

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
    <Popover
      open={open}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
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
    >
      {children}
    </Popover>
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
