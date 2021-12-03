import React, { useEffect } from 'react'
import { styled } from '@mui/material/styles'
import clsx from 'clsx'
import PropTypes from 'prop-types'
import { CircularProgress } from '@mui/material'

const PREFIX = 'RSFLoadMask'

const defaultClasses = {
  root: `${PREFIX}-root`,
  fullscreen: `${PREFIX}-fullscreen`,
  transparent: `${PREFIX}-transparent`,
  alignTop: `${PREFIX}-alignTop`,
  show: `${PREFIX}-show`,
}

const Root = styled('div')(({ theme }) => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
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

  /**
   * Styles applied to the root element when [`fullscreen`](#prop-fullscreen) is `true`.
   */
  [`&.${defaultClasses.fullscreen}`]: {
    height: `calc(100vh - ${theme.loadMaskOffsetTop}px)`,
    bottom: 'initial',
    zIndex: theme.zIndex.modal - 20,
    'body.moov-amp &': {
      position: 'fixed',
      marginTop: 0,
      opacity: 0.8,
    },
  },

  /**
   * Styles applied to the root element when [`transparent`](#prop-transparent) is `true`.
   */
  [`&.${defaultClasses.transparent}`]: {
    backgroundColor: 'rgba(255,255,255,0.5)',
  },

  /**
   * Styles applied to the root element when [`align`](#prop-align) is `'top'`.
   */
  [`&.${defaultClasses.alignTop}`]: {
    alignItems: 'flex-start',
    paddingTop: '200px',
  },

  /**
   * Styles applied to the root element when [`show`](#prop-show) is `true`.
   */
  [`&.${defaultClasses.show}`]: {
    display: 'flex',
  },
}))

export {}

/**
 * A load mask to display when fetching data from the server.
 */
export default function LoadMask({
  show,
  style,
  classes: c = {},
  className,
  children,
  fullscreen,
  transparent,
  align,
}) {
  const classes = { ...defaultClasses, ...c }
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
    <Root
      style={style}
      className={clsx(className, classes.root, {
        [classes.show]: show !== false,
        [classes.fullscreen]: fullscreen,
        [classes.transparent]: transparent,
        [classes.alignTop]: align === 'top',
      })}
    >
      {children || <CircularProgress className={classes.progress} color="secondary" />}
    </Root>
  )
}

LoadMask.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * If defined, `true` will display the load mask, while `false` will be hide it.
   */
  show: PropTypes.bool,

  /**
   * Set to `true` to toggle the overflow style on the body when showing.
   */
  fullscreen: PropTypes.bool,

  /**
   * Set to `true` to show partially background through the load mask
   */
  transparent: PropTypes.bool,

  /**
   * Set to `'top'` to show the spinner near the top.
   */
  align: PropTypes.oneOf(['center', 'top']),
}

LoadMask.defaultProps = {
  fullscreen: false,
  transparent: false,
  align: 'center',
}
