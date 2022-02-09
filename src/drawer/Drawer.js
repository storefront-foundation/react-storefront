import React, { useRef, useEffect, useCallback } from 'react'
import { styled, useTheme } from '@mui/material/styles'
import ResizeObserver from 'resize-observer-polyfill'
import { Drawer as MUIDrawer, Typography } from '@mui/material'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import DrawerCloseButton from './DrawerCloseButton'

const PREFIX = 'RSFDrawer'

const defaultClasses = {
  root: `${PREFIX}-root`,
  closeButton: `${PREFIX}-closeButton`,
  paper: `${PREFIX}-paper`,
  fullscreen: `${PREFIX}-fullscreen`,
  container: `${PREFIX}-container`,
  header: `${PREFIX}-header`,
  content: `${PREFIX}-content`,
  title: `${PREFIX}-title`,
}

const StyledMUIDrawer = styled(MUIDrawer)(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {},

  /**
   * Styles applied to the close button element.
   */
  [`& .${defaultClasses.closeButton}`]: {},

  /**
   * Styles applied to the drawer's `Paper` component.
   */
  [`& .${defaultClasses.paper}`]: {
    overflowY: 'visible',
  },

  /**
   * Styles applied to the drawer's `Paper` component if [`fullscreen`](#prop-fullscreen) is `true`.
   */
  [`& .${defaultClasses.fullscreen}`]: {
    height: '100vh',
  },

  /**
   * Styles applied to the drawer's wrapper element.
   */
  [`& .${defaultClasses.container}`]: {
    height: '100%',
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
  },

  /**
   * Styles applied to the drawer's header element.
   */
  [`& .${defaultClasses.header}`]: {
    position: 'relative',
  },

  /**
   * Styles applied to the wrapper around the drawer's children.
   */
  [`& .${defaultClasses.content}`]: {
    flexBasis: '100%',
    overflow: 'auto',
  },

  /**
   * Styles applied to the drawer's title element.
   */
  [`& .${defaultClasses.title}`]: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    width: '100%',
    height: '72px',
    lineHeight: '72px',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
}))

export {}

/**
 * A slide-in drawer with fab close button.
 */
export default function Drawer({
  variant,
  showCloseButton,
  open,
  onClose = () => {},
  title,
  children,
  className,
  classes: c = {},
  autoAdjustBodyPadding,
  anchor,
  fullscreen,
  ...rest
}) {
  const classes = { ...defaultClasses, ...c }
  const theme = useTheme()
  const drawer = useRef(null)
  const drawerResize = useRef(null)

  const setPadding = useCallback(() => {
    if (autoAdjustBodyPadding) {
      requestAnimationFrame(() => {
        const el = drawer.current
        document.body.style.paddingBottom = el && `${el.clientHeight}px`
      })
    }
  }, [autoAdjustBodyPadding])

  const closeDrawer = useCallback(() => {
    if (onClose) {
      onClose()
    }

    document.body.style.paddingBottom = 0
  }, [onClose])

  useEffect(() => {
    const el = drawer.current

    setPadding()

    if (autoAdjustBodyPadding && el) {
      drawerResize.current = new ResizeObserver(() => {
        document.body.style.paddingBottom = el && `${el.clientHeight}px`
      })
      drawerResize.current.observe(el)
    }

    return () => {
      if (drawerResize.current && el) {
        drawerResize.current.unobserve(el)
      }
    }
  }, [])

  return (
    <StyledMUIDrawer
      elevation={2}
      anchor={anchor}
      style={{
        zIndex: theme.zIndex.modal + 20,
      }}
      classes={{
        root: clsx({
          className,
          [classes.root]: true,
        }),
        paper: clsx({
          [classes.paper]: true,
          [classes.fullscreen]: fullscreen,
        }),
      }}
      open={open}
      variant={variant}
      onClose={onClose}
      {...rest}
    >
      <div className={classes.container} ref={drawer}>
        <div className={classes.header}>
          {title && (
            <Typography className={classes.title} variant="h6" component="div">
              {title}
            </Typography>
          )}
          {showCloseButton && (
            <DrawerCloseButton
              onClick={closeDrawer}
              fullscreen={fullscreen}
              open={open}
              className={clsx(classes.closeButton)}
            />
          )}
        </div>
        <div className={classes.content}>{children}</div>
      </div>
    </StyledMUIDrawer>
  )
}
Drawer.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * CSS class to apply to the root element.
   */
  className: PropTypes.string,

  /**
   * Child nodes to show inside the Drawer.
   */
  children: PropTypes.node.isRequired,

  /**
   * If `false`, the close button will be hidden.
   */
  showCloseButton: PropTypes.bool,

  /**
   * If `true`, the drawer will cover the whole screen.
   */
  fullscreen: PropTypes.bool,

  /**
   * A function that is called when the user closes the drawer.
   */
  onClose: PropTypes.func.isRequired,

  /**
   * The title to display at the top of the drawer.
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * If `true`, padding will be automatically added to the body when the drawer
   * is open so that the user is able to scroll and see all of the body content.
   */
  autoAdjustBodyPadding: PropTypes.bool,

  /**
   * Side from which the drawer will appear (top, left, right, bottom).
   */
  anchor: PropTypes.oneOf(['top', 'bottom', 'left', 'right']),

  /**
   * The variant to use for the MaterialUI [`Drawer`)(https://mui.com/api/drawer/#props).
   */
  variant: PropTypes.oneOf(['permanent', 'persistent', 'temporary']),
  open: PropTypes.bool,
}

Drawer.defaultProps = {
  showCloseButton: true,
  autoAdjustBodyPadding: false,
  variant: 'temporary',
  anchor: 'bottom',
}
