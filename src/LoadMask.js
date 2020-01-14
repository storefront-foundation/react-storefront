/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { useEffect } from 'react'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { CircularProgress } from '@material-ui/core'

export const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    height: '100%',
    width: '100%',
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.background.default,
    zIndex: 1,
  },
  fullscreen: {
    height: `calc(100vh - ${theme.loadMaskOffsetTop}px)`,
    bottom: 'initial',
    zIndex: theme.zIndex.modal - 20,
    'body.moov-amp &': {
      position: 'fixed',
      marginTop: 0,
      opacity: 0.8,
    },
  },
  transparent: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },
  alignTop: {
    alignItems: 'flex-start',
    paddingTop: '200px',
  },
  show: {
    display: 'flex',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFLoadMask' })

/**
 * The load mask displays when fetching data from the server.
 */
export default function LoadMask({
  classes,
  show,
  style,
  className,
  children,
  fullscreen,
  transparent,
  align,
}) {
  classes = useStyles({ classes })

  useEffect(() => {
    if (fullscreen) {
      document.body.style.overflow = show ? 'hidden' : 'visible'
    }
  }, [show, fullscreen])

  useEffect(() => () => {
    if (fullscreen) {
      document.body.style.overflow = 'visible'
    }
  })

  return (
    <div
      style={style}
      className={clsx({
        [classes.root]: true,
        [className]: className != null,
        [classes.show]: show !== false,
        [classes.fullscreen]: fullscreen,
        [classes.transparent]: transparent,
        [classes.alignTop]: align === 'top',
      })}
    >
      {children || <CircularProgress className={classes.progress} color="secondary" />}
    </div>
  )
}

LoadMask.propTypes = {
  /**
   * Set to true to display the load mask, otherwise it will be hidden.
   * Defaults to false.
   */
  show: PropTypes.bool,

  /**
   * Set to true to toggle the overflow style on the body when showing.
   * Defaults to false
   */
  fullscreen: PropTypes.bool,

  /**
   * Set to true to show partially background through the load mask
   */
  transparent: PropTypes.bool,

  /**
   * Set to top to show the spinner near the top. Defaults to 'center'
   */
  align: PropTypes.oneOf(['center', 'top']),
}

LoadMask.defaultProps = {
  show: null,
  fullscreen: false,
  transparent: false,
  align: 'center',
}
