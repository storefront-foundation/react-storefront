/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import { Helmet } from 'react-helmet'
import classnames from 'classnames'
import withStyles from '@material-ui/core/styles/withStyles'
import { inject } from 'mobx-react'
import PropTypes from 'prop-types'

export const styles = theme => ({
  root: {
    height: '300px',
    width: '450px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'stretch',
    position: 'relative',
    '& > *': {
      paddingBottom: 'none'
    },
    '& *[role=button]': {
      borderRadius: '50%',
      opacity: '0.5',
      outline: 'none',
      backgroundColor: 'rgba(0,0,0,0.3)'
    }
  },

  carouselWrap: {
    flex: 1,
    position: 'relative'
  },
  
  thumbnails: {
    marginTop: '10px',
    whiteSpace: 'nowrap',
    display: 'flex',
    alignItems: 'stretch',
    maxWidth: '100%',
    overflowX: 'auto'
  },

  thumbnailsWrap: {
    display: 'flex',
    margin: 'auto',
    justifyContent: 'flex-start'
  },

  thumbnail: {
    height: '50px',
    width: '50px',
    position: 'relative',
    margin: '0 2px',
    border: 'none',
    outline: 'none',
    background: 'none',
    opacity: 0.7,
    '& img': {
      objectFit: 'contain'
    }
  },

  thumbnailSelected: {
    opacity: 1
  },

  dot: { },
  dots: { },
  dotSelected: {},

  '@global': {
    'amp-lightbox-gallery div[aria-label="Gallery"]': {
      display: 'none'
    }
  }
})

/**
 * An AMP-compatible image switcher with pinch and zoom.
 */
@withStyles(styles, { name: 'RSFAmpImageSwitcher' })
@inject('nextId', 'ampStateId')
export default class AmpImageSwitcher extends Component {

  static propTypes = {
    /**
     * The amp-carousel type.  Can be "slides" or "carousel".  Defaults to "slides".
     */
    type: PropTypes.oneOf(['slides', 'carousel']),

    /**
     * Set to true to display dots indicated which image in the series is selected.  Defaults to false
     */
    indicators: PropTypes.bool,

    /**
     * The property in the amp state to bind to.  Defaults to "selectedImage"
     */
    ampStateProperty: PropTypes.string,

    /**
     * Set to true to display left and right arrows.  Defaults to false
     */
    arrows: PropTypes.bool
  }

  static defaultProps = {
    type: 'slides',
    indicators: false,
    ampStateProperty: 'selectedImage',
    controls: false
  }

  constructor({ id, nextId }) {
    super()
    id = id || nextId()
    this.id = id || `moov-image-switcher-${id}`
    this.ampStateId = `moovImageSwitcherState${id}`
  }

  render() {
    let { type, arrows, indicators, ampStateId, ampStateProperty, images, thumbnails, classes, className } = this.props
    const { id } = this

    return (
      <div className={classnames(className, classes.root)}>
        <Helmet>
          <script async custom-element="amp-carousel" src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"/>
          <script async custom-element="amp-lightbox-gallery" src="https://cdn.ampproject.org/v0/amp-lightbox-gallery-0.1.js"/>
        </Helmet>
        <div className={classes.carouselWrap}>
          <amp-carousel 
            controls={arrows ? true : undefined}
            id={id}
            layout="fill" 
            type={type}
            amp-bind={`slide=>${ampStateId}.${ampStateProperty}`}
            on={`slideChange:AMP.setState({ ${ampStateId}: { ${ampStateProperty}: event.index } })`}
          >
            {images.map(({ src, alt }) => (
              <amp-img 
                key={src}
                lightbox
                src={src}
                layout="fill"
                alt={alt}
              />
            ))}
          </amp-carousel>
          {indicators && (
            <div className={classes.dots}>
              {images.map(({ src }, i) => (
                <div 
                  key={src}
                  amp-bind={`class=>${ampStateId}.${ampStateProperty} == ${i} ? '${classes.dot} ${classes.dotSelected}' : '${classes.dot}'`}
                  className={classnames(
                    classes.dot,
                    { [classes.dotSelected]: i === 0 }
                  )}
                />
              ))}
            </div>
          )}
        </div>
        { thumbnails && thumbnails.length && (
          <div className={classes.thumbnails}>
            <div className={classes.thumbnailsWrap}>
              {thumbnails.map(({ src, alt }, i) => (
                <button 
                  key={src}
                  type="button"
                  on={`tap:AMP.setState({ ${ampStateId}: { ${ampStateProperty}: ${i} }})`} 
                  className={classes.thumbnail}
                >
                  <amp-img 
                    src={src}
                    alt={alt}
                    layout="fill"
                    amp-bind={`class=>${ampStateId}.${ampStateProperty} == ${i} ? '${classes.thumbnail} ${classes.thumbnailSelected}' : '${classes.thumbnail}'`}
                    class={classnames(
                      classes.thumbnail,
                      { [classes.thumbnailSelected]: i === 0 }
                    )}
                  />
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    )
  }

}