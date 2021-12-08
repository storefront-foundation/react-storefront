import React from 'react'
import { styled } from '@mui/material/styles'
import PropTypes from 'prop-types'
import useNavigationEvent from 'react-storefront/hooks/useNavigationEvent'
import Drawer from '../drawer/Drawer'

const PREFIX = 'RSFSearch'

const defaultClasses = {
  paper: `${PREFIX}-paper`,
  closeButton: `${PREFIX}-closeButton`,
}

export default function SearchDrawer({
  DrawerComponent,
  classes: c = {},
  open,
  onClose,
  children,
}) {
  const classes = { ...defaultClasses, ...c }
  const StyledDrawerComponent = styled(DrawerComponent)(({ theme }) => ({
    /**
     * Styles applied to the paper component in the [Drawer](/apiReference/drawer/Drawer).
     */
    [`& .${classes.paper}`]: {
      display: 'flex',
    },

    /**
     * Styles applied to the root element in the [DrawerCloseButton](/apiReference/drawer/DrawerCloseButton).
     */
    [`& .${classes.closeButton}`]: {
      color: theme.palette.primary.contrastText,
    },
  }))

  const handleNavigation = () => {
    if (onClose) {
      onClose()
    }
  }

  useNavigationEvent(handleNavigation)

  return (
    <StyledDrawerComponent
      classes={classes}
      open={open}
      anchor="bottom"
      onClose={onClose}
      fullscreen
    >
      {children}
    </StyledDrawerComponent>
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
  onClose: PropTypes.func.isRequired,

  /**
   * A component type to use for the drawer.
   */
  DrawerComponent: PropTypes.elementType,
}

SearchDrawer.defaultProps = {
  DrawerComponent: Drawer,
}
