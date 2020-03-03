import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'
import SearchContext from './SearchContext'

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

export default function SearchPopover({ classes, children, open, onClose, anchor }) {
  classes = useStyles({ classes })
  const { setQuery } = useContext(SearchContext)

  const onNavigation = () => {
    onClose()
    setQuery('')
    anchor.current.blur()
  }

  useNavigationEvent(onNavigation)

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
