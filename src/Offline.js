import React from 'react'
import { styled } from '@mui/material/styles'
import { Typography } from '@mui/material'
import { CloudOff as CloseOffIcon } from '@mui/icons-material'
import PropTypes from 'prop-types'

const PREFIX = 'RSFOffline'

const defaultClasses = {
  root: `${PREFIX}-root`,
  icon: `${PREFIX}-icon`,
  heading: `${PREFIX}-heading`,
  message: `${PREFIX}-message`,
}

const Root = styled('div')(() => ({
  /**
   * Styles applied to the root element.
   */
  [`&.${defaultClasses.root}`]: {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    alignItems: 'center',
    marginTop: '40px',
    color: '#999',
  },

  /**
   * Styles applied to the icon element.
   */
  [`& .${defaultClasses.icon}`]: {
    fontSize: 60,
    color: '#999',
  },

  /**
   * Styles applied to the heading element.
   */
  [`& .${defaultClasses.heading}`]: {},

  /**
   * Styles applied to the message element.
   */
  [`& .${defaultClasses.message}`]: {},
}))

/**
 * A page to display when in Offline mode
 */
export default function Offline({ classes: c = {}, heading, message, Icon }) {
  const classes = { ...defaultClasses, ...c }
  return (
    <Root className={classes.root}>
      <Icon className={classes.icon} />
      <Typography variant="h6" component="h1" className={classes.heading}>
        {heading}
      </Typography>
      <Typography variant="caption" className={classes.message}>
        {message}
      </Typography>
    </Root>
  )
}

Offline.propTypes = {
  /**
   * Override or extend the styles applied to the component. See [CSS API](#css) below for more details.
   */
  classes: PropTypes.object,

  /**
   * Text (or an element) to display as the heading.
   */
  heading: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * Text (or an element) to display as the message.
   */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),

  /**
   * An icon to display.
   */
  Icon: PropTypes.elementType,
}

Offline.defaultProps = {
  heading: "You're offline",
  message: 'Please check your internet connection',
  Icon: () => <CloseOffIcon />,
}
