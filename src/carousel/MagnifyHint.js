import { useAmp } from 'next/amp'
import { styled } from '@mui/material/styles'
import React from 'react'
import PropTypes from 'prop-types'
import { Typography } from '@mui/material'
import { AddCircleOutline as Icon } from '@mui/icons-material'
import clsx from 'clsx'

const PREFIX = 'RSFMagnifyHint'

const classes = {
  root: `${PREFIX}-root`,
  wrap: `${PREFIX}-wrap`,
  icon: `${PREFIX}-icon`,
  text: `${PREFIX}-text`,
  over: `${PREFIX}-over`,
  zoomDisabled: `${PREFIX}-zoomDisabled`,
  expandDisabled: `${PREFIX}-expandDisabled`,
  zoomTextDesktop: `${PREFIX}-zoomTextDesktop`,
  expandTextMobile: `${PREFIX}-expandTextMobile`,
  expandTextDesktop: `${PREFIX}-expandTextDesktop`,
}

const Root = styled('div')(() => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${classes.root}`]: {
    position: 'absolute',
    bottom: 30,
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
  },

  /**
   * Styles applied to the root element when [`over`](#prop-over) is `true`.
   */
  [`&.${classes.over}`]: {},

  /**
   * Styles applied to the root element when [`zoomDisabled`](#prop-zoomDisabled) is `true`.
   */
  [`&.${classes.zoomDisabled}`]: {},

  /**
   * Styles applied to the root element when [`expandDisabled`](#prop-expandDisabled) is `true`.
   */
  [`&.${classes.expandDisabled}`]: {
    // hide the whole component when:
    // - both zoom and expand are disabled
    // - expand is disabled and user is mobile
    [`&.${classes.zoomDisabled}`]: {
      display: 'none',
      '@media (hover: none) and (pointer: coarse)': {
        display: 'none',
      },
    },
  },
}))

const Wrap = styled('div')(() => ({
  [`&.${classes.wrap}`]: {
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    lineHeight: 14,
    padding: '5px 10px',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
  },
}))

const StyledIcon = styled(Icon)(({ theme }) => ({
  /**
   * Styles applied to the magnification icon element.
   */
  [`& .${classes.icon}`]: {
    height: 16,
    width: 16,
    color: theme.palette.grey[300],
  },
}))

const StyledTypography = styled(Typography)(({ theme }) => ({
  /**
   * Styles applied to the elements containing each of the text captions.
   */
  [`&.${classes.text}`]: {
    marginLeft: 5,
    color: theme.palette.grey[300],
    position: 'relative',
    top: 1,
  },
  /**
   * Styles applied to the element containing the [zoomTextDesktop](#prop-zoomTextDesktop) caption.
   */
  [`&.${classes.zoomTextDesktop}`]: {
    display: 'block',
    // hide zoom text when:
    // - hovering + expand is enabled
    // - zoom is disabled
    // - mobile user
    [`.${classes.over}:not(.${classes.expandDisabled}) &, .${classes.zoomDisabled} &`]: {
      display: 'none',
    },
    '@media (hover: none) and (pointer: coarse)': {
      display: 'none',
    },
  },

  /**
   * Styles applied to the element containing the [expandTextMobile](#prop-expandTextMobile) caption.
   */
  [`&.${classes.expandTextMobile}`]: {
    display: 'none',
    '@media (hover: none) and (pointer: coarse)': {
      display: 'block',
    },
  },

  /**
   * Styles applied to the element containing the [expandTextDesktop](#prop-expandTextDesktop) caption.
   */
  [`&.${classes.expandTextDesktop}`]: {
    display: 'none',

    [`.${classes.over}:not(.${classes.expandDisabled}) &, .${classes.zoomDisabled} &`]: {
      display: 'block',
    },
    '@media (hover: none) and (pointer: coarse)': {
      display: 'none',
    },
  },
}))
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
  const isAmp = useAmp()
  disableZoom = disableZoom || isAmp

  return (
    <Root
      className={clsx(className, {
        [classes.root]: true,
        [classes.over]: over,
        [classes.zoomDisabled]: disableZoom,
        [classes.expandDisabled]: disableExpand,
      })}
    >
      <Wrap className={classes.wrap}>
        <StyledIcon className={classes.icon} alt="magnify-icon" />
        <StyledTypography variant="caption" className={clsx(classes.text, classes.zoomTextDesktop)}>
          {zoomTextDesktop}
        </StyledTypography>
        <StyledTypography
          variant="caption"
          className={clsx(classes.text, classes.expandTextMobile)}
        >
          {expandTextMobile}
        </StyledTypography>
        <StyledTypography
          variant="caption"
          className={clsx(classes.text, classes.expandTextDesktop)}
        >
          {expandTextDesktop}
        </StyledTypography>
      </Wrap>
    </Root>
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
  over: PropTypes.bool,
}

MagnifyHint.defaultProps = {
  zoomTextDesktop: 'Hover to Zoom',
  expandTextMobile: 'Tap to Expand',
  expandTextDesktop: 'Click to Expand',
}
