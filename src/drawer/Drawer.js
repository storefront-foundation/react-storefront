import React, { useRef, useEffect, useCallback } from 'react'
import ResizeObserver from 'resize-observer-polyfill'
import { Drawer as MUIDrawer, Typography } from '@material-ui/core'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import DrawerCloseButton from './DrawerCloseButton'

/**
 * A slide-in drawer with fab close button.
 */
export const styles = theme => ({
  root: {},

  closeButton: {},

  fullscreen: {
    height: '100vh',
  },

  header: {
    position: 'relative',
  },

  container: {
    height: '100%',
    boxSizing: 'border-box',
    flexWrap: 'nowrap',
    display: 'flex',
    flexDirection: 'column',
  },

  content: {
    flexBasis: '100%',
    overflow: 'auto',
  },

  paper: {
    overflowY: 'visible',
  },

  title: {
    flexBasis: 'auto',
    flexGrow: 0,
    flexShrink: 1,
    width: '100%',
    height: '72px',
    lineHeight: '72px',
    textAlign: 'center',
    borderBottom: `1px solid ${theme.palette.divider}`,
  },
})

const useStyles = makeStyles(styles, { name: 'RSFDrawer' })

export default function Drawer({
  variant,
  closeButtonProps,
  showCloseButton,
  open,
  onClose,
  title,
  children,
  className,
  classes,
  autoAdjustBodyPadding,
  anchor,
  fullscreen,
  ...rest
}) {
  classes = useStyles({ classes })

  const theme = useTheme()
  const drawer = useRef(null)
  const drawerResize = useRef(null)

  const setPadding = useCallback(() => {
    if (autoAdjustBodyPadding) {
      requestAnimationFrame(() => {
        const el = drawer.current
        document.body.style.paddingBottom = el && el.clientHeight + 'px'
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
        document.body.style.paddingBottom = el && el.clientHeight + 'px'
      })
      drawerResize.observe(el)
    }

    return () => {
      if (drawerResize.current && el) {
        drawerResize.current.unobserve(el)
      }
    }
  }, [])

  // useEffect(() => {
  //   if (open) {
  //     setPadding()
  //   } else {
  //     closeDrawer()
  //   }
  // }, [open])

  return (
    <MUIDrawer
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
    </MUIDrawer>
  )
}
Drawer.propTypes = {
  /**
   * Set to false to hide the close button. Defaults to true
   */
  showCloseButton: PropTypes.bool,

  /**
   * Called when the user closes the drawer
   */
  onClose: PropTypes.func.isRequired,

  /**
   * The title to display at the top of the drawer
   */
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Set to true to automatically add padding to the body when the drawer
   * is open so that the user is able to scroll and see all of the body content.
   * Defaults to false.
   */
  autoAdjustBodyPadding: PropTypes.bool,

  /**
   * Props to apply to the closeButton
   */
  closeButtonProps: PropTypes.object,

  /**
   * Side from which the drawer will appear (top, left, right, bottom). Defaults to 'bottom'
   */
  anchor: PropTypes.string,
}

Drawer.defaultProps = {
  showCloseButton: true,
  autoAdjustBodyPadding: false,
  closeButtonProps: {},
  variant: 'temporary',
  anchor: 'bottom',
}
