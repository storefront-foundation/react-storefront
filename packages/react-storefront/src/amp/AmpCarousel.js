/**
 * @license
 * Copyright © 2017-2018 Moov Corporation.  All rights reserved.
 */
import React, { Component } from 'react'
import withStyles from '@material-ui/core/styles/withStyles'
import { fade } from '@material-ui/core/styles/colorManipulator'
import classnames from 'classnames'
import PropTypes from 'prop-types'
import { Helmet } from 'react-helmet'
import AmpState from './AmpState'

export const styles = theme => ({
  root: {},

  dot: {
    backgroundColor: fade(theme.palette.text.primary, 0.25),
    width: 8,
    height: 8,
    borderWidth: '1px',
    borderStyle: 'solid',
    borderColor: theme.palette.background.paper,
    borderRadius: '50%',
    display: 'inline-block',
    margin: '0 2px',
    // Same duration as SwipeableViews animation
    transitionDuration: '0.35s'
  },

  dotSelected: {
    backgroundColor: theme.palette.text.primary
  },

  dots: {
    position: 'absolute',
    bottom: '5px',
    textAlign: 'center',
    width: '100%'
  }
})

/**
 * A swipeable image selector suitable for PDPs
 */
@withStyles(styles, { name: 'RSFAmpCarousel' })
export default class AmpCarousel extends Component {
  static propTypes = {
    /**
     * Display left/right arrows for navigating through images
     */
    arrows: PropTypes.bool,

    /**
     * Display indicator dots at the bottom of the component
     */
    indicators: PropTypes.bool,

    /*
     * Option to manually set the selected index
     */
    selectedIndex: PropTypes.number,

    /**
     * Height on carousel container, defaults to 200
     */
    height: PropTypes.number,

    /**
     * AMP layout type, defaults to "fixed-height"
     */
    layout: PropTypes.string,

    /**
     * The property in the amp state to bind to.  Defaults to "selectedIndex"
     */
    ampStateProperty: PropTypes.string,

    /**
     * If false, the auto play behavior is disabled
     */
    autoplay: PropTypes.bool,

    /**
     * Delay between auto play transitions (in ms)
     */
    interval: PropTypes.number,

    /**
     * Amount of pixels of spacing between each slide
     */
    slideSpacing: PropTypes.number
  }

  static defaultProps = {
    arrows: true,
    indicators: false,
    height: 200,
    layout: 'fixed-height',
    ampStateProperty: 'selectedIndex',
    autoplay: false,
    interval: 3000,
    slideSpacing: 0
  }

  renderDot(index) {
    const { classes, ampStateProperty } = this.props
    return (
      <div
        key={index}
        className={classnames(classes.dot, {
          [classes.dotSelected]: index === 0
        })}
        amp-bind={`class=>rsfCarousel.${ampStateProperty} == ${index} ? '${classes.dot} ${
          classes.dotSelected
        }' : '${classes.dot}'`}
      />
    )
  }

  render() {
    let {
      classes,
      className,
      indicators,
      style,
      children,
      height,
      layout,
      ampStateProperty,
      autoplay,
      interval,
      slideSpacing
    } = this.props

    return (
      <div className={classnames(className, classes.root)} style={style}>
        <Helmet>
          <script
            async
            custom-element="amp-carousel"
            src="https://cdn.ampproject.org/v0/amp-carousel-0.1.js"
          />
        </Helmet>
        <AmpState id="rsfCarousel" initialState={{ [ampStateProperty]: 0 }} />
        <amp-carousel
          controls
          height={height}
          layout={layout}
          type="slides"
          on={`slideChange:AMP.setState({ rsfCarousel: { ${ampStateProperty}: event.index } })`}
          {...(autoplay ? { autoplay, delay: interval } : {})}
        >
          {React.Children.map(children, e => (
            <div
              style={{
                padding: `0 ${slideSpacing}px`
              }}
            >
              {e}
            </div>
          ))}
        </amp-carousel>
        {indicators && (
          <div className={classes.dots}>
            {React.Children.map(children, (e, index) => this.renderDot(index))}
          </div>
        )}
      </div>
    )
  }
}
