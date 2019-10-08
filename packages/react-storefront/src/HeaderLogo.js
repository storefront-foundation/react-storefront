/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import Link from './Link'
import { withStyles } from '@material-ui/core/'
import Track from './Track'
import classnames from 'classnames'
import PropTypes from 'prop-types'

export const styles = theme => ({
  logoWrap: {
    position: 'absolute',
    left: '50%',
    width: '120px',
    marginLeft: 'calc(-120px/2)',
    height: '100%',
    display: 'flex',
    alignItems: 'center',

    '& svg': {
      width: '100%',
      height: '100%'
    },

    [theme.breakpoints.up('md')]: {
      position: 'relative',
      left: 0,
      marginLeft: 10
    }
  },

  altText: {
    visibility: 'collapse',
    position: 'absolute'
  }
})

/**
 * A wrapper for the logo in the app header which automatically links to the home page and fires
 * the logo_clicked analytics event
 *
 * Usage:
 *
 *  import MyLogo from '/path/to/logo.svg'
 *
 *  <HeaderLogo>
 *    <MyLogo/>
 *  </HeaderLogo>
 *
 */
@withStyles(styles, { name: 'RSFHeaderLogo' })
export default class HeaderLogo extends Component {
  static propTypes = {
    /**
     * The alt text to use for accessibility.  Defaults to "brand logo"
     */
    alt: PropTypes.string,

    /**
     * Props for link component. See <Link /> component for details
     */
    linkProps: PropTypes.object,
  }

  static defaultProps = {
    alt: 'brand logo',
    linkProps: {}
  }

  render() {
    const { classes, children, alt, linkProps } = this.props

    return (
      <Track event="logoClicked">
        <Link to="/" className={classnames(classes.logoWrap)} {...linkProps}>
          <span className={classes.altText}>{alt}</span>
          {children}
        </Link>
      </Track>
    )
  }
}
