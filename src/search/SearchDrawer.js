import React from 'react'
import Drawer from '../drawer/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import SearchProvider from './SearchProvider'

export const styles = theme => ({
  paper: {
    display: 'flex',
  },
  closeButton: {
    color: theme.palette.primary.contrastText,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearch' })

export default function SearchDrawer({ DrawerComponent, classes, open, onClose, children }) {
  classes = useStyles({ classes })

  return (
    <SearchProvider onClose={onClose}>
      <DrawerComponent classes={classes} open={open} anchor="bottom" onClose={onClose} fullscreen>
        {children}
      </DrawerComponent>
    </SearchProvider>
  )
}

SearchDrawer.propTypes = {
  DrawerComponent: PropTypes.func,
}

SearchDrawer.defaultProps = {
  DrawerComponent: Drawer,
}
