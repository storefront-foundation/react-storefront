import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar as MUIAppBar, Toolbar, useScrollTrigger, Slide } from '@material-ui/core'
import PropTypes from 'prop-types'
import PWAContext from './PWAContext'
import clsx from 'clsx'

const useStyles = makeStyles(theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    boxSizing: 'border-box',
    backgroundColor: theme.palette.background.default,
    boxShadow: 'none',
    borderBottom: `1px solid ${theme.palette.divider}`,
    zIndex: theme.zIndex.modal + 10,
    height: theme.headerHeight,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
  },
  relative: {
    position: 'relative',
  },
  /**
   * Styles applied to the spacer that fills the height behind the floating toolbar.
   */
  spacer: {
    boxSizing: 'border-box',
    height: theme.headerHeight,
  },
  /**
   * Styles applied to the `Toolbar` element.
   */
  toolbar: {
    justifyContent: 'space-between',
    alignItems: 'center',
    flex: 1,
  },
  /**
   * Styles applied to the offline warning element.
   */
  offline: {
    textAlign: 'center',
    backgroundColor: '#f34c4c',
    zIndex: 999999,
    width: '100vw',
    color: 'white',
  },
}))

export default function AppBar({ children, style, variant, fixed, offlineWarning, classes }) {
  if (fixed) {
    variant = 'fixed'
  }

  const trigger = useScrollTrigger()
  classes = useStyles({ classes })

  const { offline } = useContext(PWAContext)

  let appBar = (
    <MUIAppBar
      className={clsx({
        [classes.root]: true,
        [classes.relative]: variant === 'relative',
      })}
      style={{
        ...style,
      }}
    >
      <Toolbar disableGutters className={classes.toolbar}>
        {children}
      </Toolbar>
    </MUIAppBar>
  )

  if (variant === 'hide') {
    appBar = (
      <Slide appear={false} in={!trigger}>
        {appBar}
      </Slide>
    )
  }

  return (
    <>
      {(variant === 'hide' || variant === 'fixed') && <div className={classes.spacer} />}
      {offline && <div className={classes.offline}>{offlineWarning}</div>}
      {appBar}
    </>
  )
}

AppBar.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Affixes the AppBar to the top of the viewport. This prop is deprecated.
   * Use `variant="fixed"` instead.
   * @deprecated
   */
  fixed: PropTypes.bool,

  /**
   * String or Element to render within the offline warning container at the top of the app.
   */
  offlineWarning: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * * relative - The AppBar stays at the top of the page.
   * * fixed - The AppBar stays at the top of the viewport.
   * * hide - The same as fixed, but the app bar automatically hides when the user scrolls down.
   */
  variant: PropTypes.oneOf(['relative', 'fixed', 'hide']),
}

AppBar.defaultProps = {
  offlineWarning: 'Your device lost its internet connection.',
  variant: 'hide',
  fixed: false,
}
