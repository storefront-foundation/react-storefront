import { useAmp } from 'next/amp'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { AddCircleOutline as Icon } from '@material-ui/icons'
import clsx from 'clsx'

const styles = theme => ({
  /**
   * Styles applied to the root element.
   */
  root: {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  /**
   * Styles applied to the content wrapper element.
   */
  wrap: {
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    lineHeight: 14,
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  /**
   * Styles applied to the magnification icon element.
   */
  icon: {
    height: 16,
    width: 16,
    color: theme.palette.grey[300],
  },
  /**
   * Styles applied to the elements containing each of the text captions.
   */
  text: {
    marginLeft: 5,
    color: theme.palette.grey[300],
    position: 'relative',
    top: 1,
  },
  /**
   * Styles applied to the root element when [`over`](#prop-over) is `true`.
   */
  over: {},
  /**
   * Styles applied to the root element when [`zoomDisabled`](#prop-zoomDisabled) is `true`.
   */
  zoomDisabled: {},
  /**
   * Styles applied to the root element when [`expandDisabled`](#prop-expandDisabled) is `true`.
   */
  expandDisabled: {
    // hide the whole component when:
    // - both zoom and expand are disabled
    // - expand is disabled and user is mobile
    '$zoomDisabled&': {
      display: 'none',
    },
    '@media not all and (hover: none)': {
      display: 'none',
    },
  },
  /**
   * Styles applied to the element containing the [zoomTextDesktop](#prop-zoomTextDesktop) caption.
   */
  zoomTextDesktop: {
    display: 'block',
    // hide zoom text when:
    // - hovering + expand is enabled
    // - zoom is disabled
    // - mobile user
    '$over:not($expandDisabled) &, $zoomDisabled &': {
      display: 'none',
    },
    '@media not all and (hover: none)': {
      display: 'none',
    },
  },
  /**
   * Styles applied to the element containing the [expandTextMobile](#prop-expandTextMobile) caption.
   */
  expandTextMobile: {
    display: 'none',
    '@media (hover: none) and (pointer: coarse)': {
      display: 'block',
    },
  },
  /**
   * Styles applied to the element containing the [expandTextDesktop](#prop-expandTextDesktop) caption.
   */
  expandTextDesktop: {
    display: 'none',

    '$over:not($expandDisabled) &, $zoomDisabled &': {
      display: 'block',
      '@media (hover: none) and (pointer: coarse)': {
        display: 'none',
      },
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFMagnifyHint' })

/**
 * An element overlaid on a [`Carousel`](/apiReference/carousel/Carousel) that displays a tip for a
 * user to hover/click the Carousel in order to zoom in.
 */
export default function MagnifyHint({
  zoomTextDesktop,
  expandTextMobile,
  expandTextDesktop,
  over,
  className,
  disableZoom,
  disableExpand,
}) {
  const classes = useStyles()
  disableZoom = disableZoom || useAmp()

  return (
    <div
      className={clsx(className, {
        [classes.root]: true,
        [classes.over]: over,
        [classes.zoomDisabled]: disableZoom,
        [classes.expandDisabled]: disableExpand,
      })}
    >
      <div className={classes.wrap}>
        <Icon className={classes.icon} alt="magnify-icon" />
        <Typography variant="caption" className={clsx(classes.text, classes.zoomTextDesktop)}>
          {zoomTextDesktop}
        </Typography>
        <Typography variant="caption" className={clsx(classes.text, classes.expandTextMobile)}>
          {expandTextMobile}
        </Typography>
        <Typography variant="caption" className={clsx(classes.text, classes.expandTextDesktop)}>
          {expandTextDesktop}
        </Typography>
      </div>
    </div>
  )
}

MagnifyHint.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * CSS class to apply to the root element.
   */
  className: PropTypes.string,

  /**
   * The text displayed to tell the user to hover to zoom.
   */
  zoomTextDesktop: PropTypes.string,

  /**
   * The text displayed to tell a mobile user to tap to expand.
   */
  expandTextMobile: PropTypes.string,

  /**
   * The text displayed to tell a desktop user to click to expand.
   */
  expandTextDesktop: PropTypes.string,

  /**
   * If `true`, zooming is disabled and the hint for zooming is not shown.
   */
  disableZoom: PropTypes.bool,

  /**
   * If `true`, expanding is disabled and the hint for expanding is not shown.
   */
  disableExpand: PropTypes.bool,
}

MagnifyHint.defaultProps = {
  zoomTextDesktop: 'Hover to Zoom',
  expandTextMobile: 'Tap to Expand',
  expandTextDesktop: 'Click to Expand',
}
