import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Popover } from '@material-ui/core'

export const styles = theme => ({
  /**
   * Styles applied to the popover paper
   */
  popoverPaper: {
    boxShadow: '0px 5px 5px -3px rgba(0,0,0,0.2), 0px 8px 10px 1px rgba(0,0,0,0.14)',
    minWidth: theme.spacing(84),
    minHeight: theme.spacing(75),
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearchPopover' })

export default function SearchPopover({ classes, children, open, onClose, anchor }) {
  classes = useStyles({ classes })

  return (
    <Popover
      open={open}
      disableAutoFocus
      disableEnforceFocus
      disableRestoreFocus
      disablePortal
      keepMounted
      onClose={onClose}
      anchorEl={anchor}
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
