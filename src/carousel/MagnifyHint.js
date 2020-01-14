import { useAmp } from 'next/amp'
import React from 'react'
import PropTypes from 'prop-types'
import { makeStyles } from '@material-ui/core/styles'
import { Typography } from '@material-ui/core'
import { AddCircleOutline as Icon } from '@material-ui/icons'
import clsx from 'clsx'

const styles = theme => ({
  root: {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },
  wrap: {
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    lineHeight: 14,
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
  icon: {
    height: 16,
    width: 16,
    color: theme.palette.grey[300],
  },
  text: {
    marginLeft: 5,
    color: theme.palette.grey[300],
    position: 'relative',
    top: 1,
  },
  over: {},
  zoomDisabled: {},
  expandDisabled: {
    // hide the whole component when:
    // - both zoom and expand are disabled
    // - expand is disabled and user is mobile
    '$zoomDisabled&': {
      display: 'none',
    },
    '@media (hover:none)': {
      display: 'none',
    },
  },
  zoomTextDesktop: {
    display: 'block',
    // hide zoom text when:
    // - hovering + expand is enabled
    // - zoom is disabled
    // - mobile user
    '$over:not($expandDisabled) &, $zoomDisabled &': {
      display: 'none',
    },
    '@media (hover:none)': {
      display: 'none',
    },
  },
  expandTextMobile: {
    display: 'none',
    '@media (hover:none)': {
      display: 'block',
    },
  },
  expandTextDesktop: {
    display: 'none',

    '$over:not($expandDisabled) &, $zoomDisabled &': {
      display: 'block',
      '@media (hover:none)': {
        display: 'none',
      },
    },
  },
})

const useStyles = makeStyles(styles, { name: 'RSFMagnifyHint' })

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
  zoomTextDesktop: PropTypes.string,
  expandTextMobile: PropTypes.string,
  expandTextDesktop: PropTypes.string,
  className: PropTypes.string,
  open: PropTypes.bool,
  disableZoom: PropTypes.bool,
  disableExpand: PropTypes.bool,
}

MagnifyHint.defaultProps = {
  zoomTextDesktop: 'Hover to Zoom',
  expandTextMobile: 'Tap to Expand',
  expandTextDesktop: 'Click to Expand',
}
