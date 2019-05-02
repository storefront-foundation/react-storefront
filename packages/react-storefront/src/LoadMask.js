/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import CircularProgress from '@material-ui/core/CircularProgress'
import { withStyles } from '@material-ui/core/styles'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'none',
    justifyContent: 'center',
    alignItems: 'center',
    background: theme.palette.background.default,
    zIndex: 1
  },
  fullscreen: {
    height: `calc(100vh - ${theme.headerHeight}px)`,
    bottom: 'initial',
    zIndex: theme.zIndex.appBar - 10,
    'body.moov-amp &': {
      position: 'fixed',
      marginTop: 0,
      opacity: 0.8
    }
  },
  transparent: {
    backgroundColor: 'rgba(255,255,255,0.5)'
  },
  alignTop: {
    alignItems: 'flex-start',
    paddingTop: '200px'
  },
  show: {
    display: 'flex'
  }
})

/**
 * The load mask displays when fetching data from the server.
 */
@withStyles(styles, { name: 'RSFLoadMask' })
export default class LoadMask extends Component {
  static propTypes = {
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
     * Set to true to show the partially show the background through the load mask
     */
    transparent: PropTypes.bool,

    /**
     * Set to top to show the spinner near the top. Defaults to 'center'
     */
    align: PropTypes.oneOf(['center', 'top'])
  }

  static defaultProps = {
    show: false,
    fullscreen: false,
    align: 'center'
  }

  componentDidUpdate() {
    this.toggleOverflow()
  }

  componentDidMount() {
    this.toggleOverflow()
  }

  toggleOverflow() {
    if (this.props.fullscreen) {
      if (this.props.show) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = 'visible'
      }
    }
  }

  render() {
    const { classes, show, style, className, children, fullscreen, transparent, align } = this.props

    return (
      <div
        style={style}
        className={classnames(classes.root, className, {
          [classes.show]: show,
          [classes.fullscreen]: fullscreen,
          [classes.transparent]: transparent,
          [classes.alignTop]: align === 'top'
        })}
      >
        {children || <CircularProgress className={classes.progress} color="secondary" />}
      </div>
    )
  }

  componentWillUnmount() {
    document.body.style.overflow = 'visible'
  }
}
