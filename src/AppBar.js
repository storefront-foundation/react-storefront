import React, { useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { AppBar as MUIAppBar, Container, Toolbar, useScrollTrigger, Slide } from '@material-ui/core'
import PropTypes from 'prop-types'
import PWAContext from './PWAContext'

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
  },
  /**
   * Styles applied to the spacer that fills the height behind the floating toolbar.
   */
  spacer: {
    boxSizing: 'border-box',
  },
  /**
   * Styles applied to the `Toolbar` element.
   */
  toolbar: {
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  /**
   * Styles applied to the inner `Container` element.
   */
  container: {
    padding: 0,
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

export default function AppBar({ height, maxWidth, children, style, fixed, offlineWarning }) {
  const trigger = useScrollTrigger()
  const classes = useStyles()

  const { offline } = useContext(PWAContext)

  let appBar = (
    <MUIAppBar
      className={classes.root}
      style={{
        height,
        ...style,
      }}
    >
      <Container maxWidth={maxWidth} className={classes.container}>
        <Toolbar disableGutters className={classes.toolbar}>
          {children}
        </Toolbar>
      </Container>
    </MUIAppBar>
  )

  if (!fixed) {
    appBar = (
      <Slide appear={false} direction="down" in={!trigger}>
        {appBar}
      </Slide>
    )
  }

  return (
    <>
      <div style={{ height }} className={classes.spacer} />
      {offline && <div className={classes.offline}>{offlineWarning}</div>}
      {appBar}
    </>
  )
}

/**
 * The height of the AppBar
 */
AppBar.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * The height of the AppBar in pixels
   */
  height: PropTypes.number,

  /**
   * The max width for the inner toolbar
   */
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl']),

  /**
   * Set as `true` if the AppBar should be fixed position.
   */
  fixed: PropTypes.bool,

  /**
   * String or Element to render within the offline warning container at the top of the app.
   */
  offlineWarning: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

AppBar.defaultProps = {
  height: 58,
  maxWidth: 'lg',
  offlineWarning: 'Your device lost its internet connection.',
  fixed: false,
}
