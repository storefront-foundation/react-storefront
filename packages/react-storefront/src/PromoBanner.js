/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { withStyles } from '@material-ui/core/'
import PropTypes from 'prop-types'
import Link from './Link'
import Track from './Track'
import Image from './Image'
import classnames from 'classnames'

/**
 * A promo banner that automatically fires the promo_banner_clicked analytics event.
 */
export const styles = theme => ({
  root: {
    display: 'flex',
    justifyContent: 'center',
    zIndex: theme.zIndex.appBar - 1,
    cursor: 'pointer'
  },
  img: {
    width: '100%',
    zIndex: theme.zIndex.appBar - 1
  }
});

@withStyles(styles, { name: 'RSFPromoBanner' })
export default class PromoBanner extends Component {
  
  static propTypes = {
    /**
     * A css class to apply
     */
    className: PropTypes.string,

    /**
     * CSS classes
     */
    classes: PropTypes.object,

    /**
     * An name to idenify the banner with analytics
     */
    name: PropTypes.string,

    /**
     * The url to load for the banner image
     */
    src: PropTypes.string,

    /**
     * The location to navigate to when clicked
     */
    href: PropTypes.string,

    /**
     * An alt value for the img tag
     */
    alt: PropTypes.string,

    /**
     * Additional props for the img tag
     */
    imgProps: PropTypes.object
  }

  static defaultProps = {
    name: 'promo',
    alt: 'promo',
    imgProps: {},
  }

  render() {
    const { href, classes, onClick, name, src, alt, imgProps, className } = this.props

    return (
      <Track event="promoBannerClicked" name={name} imageUrl={src}>
        <Link to={href} className={classnames(className, classes.root)} onClick={onClick}>
          <Image className={classes.img} src={src} alt={alt} fill {...imgProps}/>
        </Link>
      </Track>
    )
  }

}
