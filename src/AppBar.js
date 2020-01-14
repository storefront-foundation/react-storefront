/**
 * @license
 * Copyright © 2017-2019 Moov Corporation.  All rights reserved.
 */
import React, { useState, useEffect, useRef, useContext } from 'react'
import PropTypes from 'prop-types'
import clsx from 'clsx'
import { Toolbar } from '@material-ui/core'
import { makeStyles } from '@material-ui/core/styles'
import { useAmp } from 'next/amp'
import PWAContext from './PWAContext'

export const styles = theme => ({
  root: {
    height: 64,
    boxSizing: 'content-box',
    position: 'relative',
    zIndex: theme.zIndex.modal + 10,
  },

  withAmp: {
    zIndex: theme.zIndex.amp.modal + 1,
  },

  offline: {
    textAlign: 'center',
    backgroundColor: '#f34c4c',
    color: 'white',
  },

  toolBar: {
    height: '64px',
    maxWidth: theme.maxWidth,
    flex: 1,
  },

  wrap: {
    borderBottom: `1px solid ${theme.palette.divider}`,
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.palette.background.paper,
    zIndex: theme.zIndex.modal + 10,
    display: 'flex',
    justifyContent: 'center',
  },

  unstuck: {
    transform: 'translateY(-100%)',
  },

  animate: {
    transition: 'transform .15s ease-in',
  },

  hidden: {
    position: 'fixed',
    zIndex: theme.zIndex.modal + 10,
    boxShadow: theme.shadows[2],
    top: 0,
    left: 0,
    right: 0,
  },

  fixed: {
    position: 'fixed',
  },

  link: {
    textDecoration: 'none',
  },
})

const useStyles = makeStyles(styles, { name: 'RSFAppBar' })

export default function AppBar({ classes, children, fixed, offlineWarning }) {
  classes = useStyles({ classes })

  const [state, applyState] = useState({
    stuck: false,
    hidden: false,
    animate: false,
  })
  const { stuck, hidden, animate } = state
  const setState = newState => applyState({ ...state, ...newState })
  const lastScrollY = useRef()
  const unstickAt = useRef()
  const stickAt = useRef()
  const { offline } = useContext(PWAContext)
  const items = React.Children.toArray(children)

  const onScroll = () => {
    const height = 64,
      { scrollY } = window,
      unstickBufferZone = 30

    if (scrollY === 0) {
      setState({ hidden: false, stuck: false, animate: false })
    } else if (scrollY > height && !hidden) {
      setState({ hidden: true })
    }

    if (scrollY < stickAt.current && !stuck) {
      stickAt.current = null
      unstickAt.current = scrollY + unstickBufferZone
      setState({ stuck: true })
    } else if (scrollY > unstickAt.current && stuck) {
      unstickAt.current = null
      stickAt.current = scrollY - unstickBufferZone
      setState({ stuck: false })
    }

    if (lastScrollY.current > scrollY && stuck) {
      unstickAt.current = scrollY + unstickBufferZone
    }

    if (lastScrollY.current < scrollY && !stuck) {
      stickAt.current = scrollY - unstickBufferZone
    }

    lastScrollY.current = scrollY
  }

  useEffect(() => {
    if (!fixed) {
      window.addEventListener('scroll', onScroll, { passive: true })
      return () => window.removeEventListener('scroll', onScroll, { passive: true })
    }
  }, [state])

  useEffect(() => {
    if (hidden && !animate) {
      setTimeout(() => setState({ animate: true }), 100)
    }
  }, [hidden])

  return (
    <div>
      {offline && <div className={classes.offline}>{offlineWarning}</div>}
      <div className={clsx({ [classes.root]: true, [classes.withAmp]: useAmp() })}>
        <div
          className={clsx({
            [classes.wrap]: true,
            [classes.fixed]: fixed,
            [classes.hidden]: hidden,
            [classes.unstuck]: hidden && !stuck,
            [classes.animate]: animate && window.scrollY > 0,
          })}
        >
          <Toolbar disableGutters classes={{ root: classes.toolBar }}>
            {items}
          </Toolbar>
        </div>
      </div>
    </div>
  )
}

AppBar.propTypes = {
  /**
   * CSS classes
   */
  classes: PropTypes.object,

  /**
   * Fixed AppBar
   */
  fixed: PropTypes.bool,

  /**
   * String or Element to render within the offline warning container at the top of the app
   */
  offlineWarning: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
}

AppBar.defaultProps = {
  offlineWarning: 'Your device lost its internet connection.',
  fixed: false,
}
