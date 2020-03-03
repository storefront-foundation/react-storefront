import React from 'react'
import Drawer from '../drawer/Drawer'
import { makeStyles } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'

export const styles = theme => ({
  /**
   * Styles applied to the paper component in the [Drawer](/apiReference/drawer/Drawer).
   */
  paper: {
    display: 'flex',
  },
  /**
   * Styles applied to the root element in the [DrawerCloseButton](/apiReference/drawer/DrawerCloseButton).
   */
  closeButton: {
    color: theme.palette.primary.contrastText,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFSearch' })

export default function SearchDrawer({ DrawerComponent, classes, open, onClose, children }) {
  classes = useStyles({ classes })

  useNavigationEvent(onClose)

  return (
    <DrawerComponent classes={classes} open={open} anchor="bottom" onClose={onClose} fullscreen>
      {children}
    </DrawerComponent>
  )
}

SearchDrawer.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Children to be rendered inside the drawer.
   */
  children: PropTypes.node,

  /**
   * If `true`, the search drawer should be open.
   */
  open: PropTypes.bool,

  /**
   * A function that is called when the user closes the drawer.
   */
  onClose: PropTypes.func,

  /**
   * A component type to use for the drawer.
   */
  DrawerComponent: PropTypes.elementType,
}

SearchDrawer.defaultProps = {
  DrawerComponent: Drawer,
}
